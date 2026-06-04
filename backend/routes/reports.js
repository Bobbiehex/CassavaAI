import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Get all reports for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.user.id },
      orderBy: { timestamp: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Save a new report
router.post('/', requireAuth, async (req, res) => {
  try {
    const { id, type, title, summary, details, imageBase64, timestamp } = req.body;
    
    // We can just use prisma generated id if we don't pass one, 
    // but dbService was sending an id like `report-${Date.now()}`.
    // It's safer to upsert or just create.
    const report = await prisma.report.create({
      data: {
        id: id || undefined,
        type,
        title,
        summary,
        details,
        imageBase64,
        timestamp,
        userId: req.user.id
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Delete a report
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Make sure the report belongs to the user
    const existing = await prisma.report.findFirst({
        where: { id, userId: req.user.id }
    });
    
    if (!existing) {
        return res.status(404).json({ error: 'Report not found' });
    }

    await prisma.report.delete({
      where: { id }
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
