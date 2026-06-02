import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get user sessions
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const sessions = await prisma.loginSession.findMany({
      where: { userId: req.user.id },
      orderBy: { loginTime: 'desc' },
      take: 10
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get all users (Admin/Super Admin only)
router.get('/', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Update user role (Admin/Super Admin only)
router.put('/:id/role', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['FARMER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent changing own role or super admin role unless super admin
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Cannot modify super admin role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true
      }
    });

    res.json({ message: 'Role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update Role Error:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// Update User Profile (Name & Avatar)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        // Only update avatar if provided in the request
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
});

// Delete User Account
router.delete('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete account. Please try again.' });
  }
});

export default router;
