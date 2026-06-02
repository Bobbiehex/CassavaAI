import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get team chat messages
router.get('/', requireAuth, async (req, res) => {
  console.log(`[BACKEND] GET /api/team-chat - User: ${req.user.email}, Role: ${req.user.role}, ID: ${req.user.id}`);
  try {
    // Only Admin and Super Admin
    if (req.user.role === 'FARMER') {
      console.log(`[BACKEND] Forbidden access to team-chat for FARMER: ${req.user.email}`);
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await prisma.teamMessage.findMany({
      include: {
        sender: { select: { id: true, name: true, role: true, avatar: true } }
      },
      orderBy: { createdAt: 'asc' },
      take: 200 // Limit to last 200 messages for performance
    });

    console.log(`[BACKEND] Found ${messages.length} team messages`);
    res.json(messages);
  } catch (error) {
    console.error('[BACKEND] Fetch team chat error:', error);
    res.status(500).json({ error: 'Failed to fetch team messages' });
  }
});

// Send a team chat message
router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'FARMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const message = await prisma.teamMessage.create({
      data: {
        senderId: req.user.id,
        text
      },
      include: {
        sender: { select: { id: true, name: true, role: true, avatar: true } }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send team message error:', error);
    res.status(500).json({ error: 'Failed to send team message' });
  }
});

export default router;
