import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET environment variable is not defined. Falling back to a temporary secret for development. Please set it in .env.');
}
const ACTIVE_SECRET = JWT_SECRET || 'agrivision-temp-secret-fallback';

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    
    // Fetch fresh user data from DB to ensure role is up-to-date
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
    }

    next();
  };
};
