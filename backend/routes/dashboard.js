import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// Helper to get start date from timeframe string
const getStartDate = (timeframe) => {
  const now = new Date();
  switch (timeframe) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    default:
      // Default to 30 days
      return new Date(now.setDate(now.getDate() - 30));
  }
};

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    const startDate = getStartDate(timeframe);

    // Get current total team members (ADMIN and SUPER_ADMIN)
    const currentTeamMembers = await prisma.user.count({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
      },
    });

    // Get team members who were created before the start of the timeframe to calculate percentage change
    const previousTeamMembers = await prisma.user.count({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
        createdAt: {
          lt: startDate,
        },
      },
    });

    // Calculate team members percentage change
    let teamMembersChange = 0;
    if (previousTeamMembers > 0) {
      teamMembersChange = ((currentTeamMembers - previousTeamMembers) / previousTeamMembers) * 100;
    } else if (currentTeamMembers > 0) {
      teamMembersChange = 100; // If previously 0 but now > 0, it's a 100% increase
    }

    res.json({
      teamMembers: currentTeamMembers,
      teamMembersChange: teamMembersChange.toFixed(1),
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
