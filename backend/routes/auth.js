import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { UAParser } from 'ua-parser-js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET environment variable is not defined. Falling back to a temporary secret for development. Please set it in .env.');
}
const ACTIVE_SECRET = JWT_SECRET || 'agrivision-temp-secret-fallback';

const getSessionInfo = (req) => {
  const ua = req.headers['user-agent'] || '';
  const parser = new UAParser(ua);
  const result = parser.getResult();
  
  const os = result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : "Unknown OS";
  const browser = result.browser.name ? `${result.browser.name} ${result.browser.version || ''}`.trim() : "Unknown Browser";
  
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown IP";
  
  return { os, browser, ip };
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userRole = role || 'FARMER'; // default role

    // Role-based Email Authorization
    if (userRole === 'SUPER_ADMIN') {
      if (email !== 'anthonyayomide2003@gmail.com') {
        return res.status(403).json({ error: 'Not authorized for SUPER_ADMIN role' });
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email },
      ACTIVE_SECRET,
      { expiresIn: '7d' }
    );

    const { os, browser, ip } = getSessionInfo(req);
    await prisma.loginSession.create({
      data: {
        userId: newUser.id,
        token,
        os,
        browser,
        ip,
        location: location || 'Unknown Location',
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password, location } = req.body;

    // Check existing user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Role-based Email Authorization (for login protection)
    if (user.role === 'SUPER_ADMIN') {
      if (email !== 'anthonyayomide2003@gmail.com') {
        return res.status(403).json({ error: 'Not authorized for SUPER_ADMIN role' });
      }
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      ACTIVE_SECRET,
      { expiresIn: '7d' }
    );

    const { os, browser, ip } = getSessionInfo(req);
    await prisma.loginSession.create({
      data: {
        userId: user.id,
        token,
        os,
        browser,
        ip,
        location: location || 'Unknown Location',
      }
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Verify Token (Used by frontend on load)
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found', valid: false });
    }

    // Check if session exists in DB
    const session = await prisma.loginSession.findUnique({ where: { token } });
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalidated', valid: false });
    }

    // Update last active
    await prisma.loginSession.update({
      where: { token },
      data: { lastActive: new Date() }
    });

    res.json({ 
      valid: true, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', valid: false });
  }
});

// Get all sessions for current user
router.get('/sessions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    const sessions = await prisma.loginSession.findMany({
      where: { userId: decoded.id },
      orderBy: { lastActive: 'desc' }
    });

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      os: s.os,
      browser: s.browser,
      ip: s.ip,
      location: s.location,
      lastActive: s.lastActive,
      isCurrent: s.token === token
    }));

    res.json(formattedSessions);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Delete a specific session
router.delete('/sessions/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    const sessionId = req.params.id;

    const session = await prisma.loginSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== decoded.id) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await prisma.loginSession.delete({ where: { id: sessionId } });
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Delete all other sessions
router.delete('/sessions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    
    await prisma.loginSession.deleteMany({
      where: { 
        userId: decoded.id,
        token: { not: token }
      }
    });

    res.json({ message: 'Other sessions deleted successfully' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Delete all sessions (including current)
router.delete('/sessions/all', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    
    await prisma.loginSession.deleteMany({
      where: { userId: decoded.id }
    });

    res.json({ message: 'All sessions deleted successfully' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout current session
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    await prisma.loginSession.delete({
      where: { token }
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    // Session might already be deleted or invalid token, ignore
    res.json({ message: 'Logged out successfully' });
  }
});

export default router;
