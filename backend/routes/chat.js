import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get chat history for a user (and optionally a farm)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { farmId } = req.query;
    const userId = req.user.id;

    const messages = await prisma.chatMessage.findMany({
      where: {
        userId,
        farmId: farmId || null
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Fetch Chat History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
});

// Save a new chat message
router.post('/', requireAuth, async (req, res) => {
  try {
    const { farmId, role, text } = req.body;
    const userId = req.user.id;

    if (!role || !text) {
      return res.status(400).json({ error: 'Role and text are required' });
    }

    const message = await prisma.chatMessage.create({
      data: {
        userId,
        farmId: farmId || null,
        role,
        text
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Save Chat Message Error:', error);
    res.status(500).json({ error: 'Failed to save chat message.' });
  }
});

// Clear chat history
router.delete('/', requireAuth, async (req, res) => {
  try {
    const { farmId } = req.query;
    const userId = req.user.id;

    await prisma.chatMessage.deleteMany({
      where: {
        userId,
        farmId: farmId || null
      }
    });

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear Chat History Error:', error);
    res.status(500).json({ error: 'Failed to clear chat history.' });
  }
});

export default router;
