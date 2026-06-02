import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get tickets
router.get('/tickets', requireAuth, async (req, res) => {
  console.log(`[BACKEND] GET /api/support/tickets - User: ${req.user.email}, Role: ${req.user.role}, ID: ${req.user.id}`);
  try {
    const userRole = req.user.role;
    let tickets;

    if (userRole === 'FARMER') {
      console.log(`[BACKEND] Fetching tickets for FARMER: ${req.user.email}`);
      // Farmers only see their own tickets
      tickets = await prisma.supportTicket.findMany({
        where: { farmerId: req.user.id },
        include: {
          messages: {
            include: { sender: { select: { id: true, name: true, role: true, avatar: true } } },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      console.log(`[BACKEND] Fetching ALL tickets for ${userRole}: ${req.user.email}`);
      // Admins and Super Admins see all tickets
      tickets = await prisma.supportTicket.findMany({
        include: {
          farmer: { select: { id: true, name: true, email: true, avatar: true } },
          messages: {
            include: { sender: { select: { id: true, name: true, role: true, avatar: true } } },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    console.log(`[BACKEND] Found ${tickets.length} tickets for user ${req.user.email} with role ${userRole}`);
    if (tickets.length > 0) {
      console.log(`[BACKEND] First ticket ID: ${tickets[0].id}`);
    } else {
      console.log(`[BACKEND] No tickets found in database for this query.`);
      // Debug: Check total tickets in DB
      const totalTickets = await prisma.supportTicket.count();
      console.log(`[BACKEND] Total tickets in DB: ${totalTickets}`);
    }
    res.json(tickets);
  } catch (error) {
    console.error('[BACKEND] Fetch tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Create a new ticket (Farmers only)
router.post('/tickets', requireAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        farmerId: req.user.id,
        subject,
        messages: {
          create: {
            senderId: req.user.id,
            text: message
          }
        }
      },
      include: {
        messages: {
          include: { sender: { select: { id: true, name: true, role: true, avatar: true } } }
        }
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Add a reply to a ticket
router.post('/tickets/:id/messages', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update ticket updatedAt and add message
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        messages: {
          create: {
            senderId: req.user.id,
            text
          }
        }
      },
      include: {
        farmer: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          include: { sender: { select: { id: true, name: true, role: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update ticket status (Escalate, Resolve)
router.put('/tickets/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Only ADMIN or SUPER_ADMIN can change status
    if (req.user.role === 'FARMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: { status },
      include: {
        farmer: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          include: { sender: { select: { id: true, name: true, role: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

export default router;
