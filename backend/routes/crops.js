import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/crops - Get all crops for the user's farms
router.get('/', requireAuth, async (req, res) => {
  console.log(`[BACKEND] GET /api/crops - User: ${req.user.email}`);
  try {
    const { farmId } = req.query;
    
    const where = {};
    if (farmId) {
      where.farmId = farmId;
    } else {
      // If no farmId, get all crops for all farms owned by the user
      const userFarms = await prisma.farm.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      where.farmId = { in: userFarms.map(f => f.id) };
    }

    const crops = await prisma.crop.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(crops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// POST /api/crops - Create a new crop
router.post('/', requireAuth, async (req, res) => {
  try {
    const { 
      name, type, fieldId, plantingDate, healthScore, ndvi, 
      soilMoisture, status, alerts, lastScanUrl, history, 
      insights, location, farmId 
    } = req.body;

    if (!name || !farmId) {
      return res.status(400).json({ error: 'Name and farmId are required' });
    }

    // Verify farm ownership
    const farm = await prisma.farm.findFirst({
      where: { id: farmId, ownerId: req.user.id }
    });

    if (!farm) {
      return res.status(403).json({ error: 'Access denied to this farm' });
    }

    const crop = await prisma.crop.create({
      data: {
        name, type, fieldId, plantingDate, 
        healthScore: healthScore || 100, 
        ndvi: ndvi || 0.5, 
        soilMoisture: soilMoisture || 50, 
        status: status || 'HEALTHY', 
        alerts: alerts || [], 
        lastScanUrl, 
        history: history || [], 
        insights: insights || {}, 
        location: location || null, 
        farmId
      }
    });

    res.status(201).json(crop);
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ error: 'Failed to create crop' });
  }
});

// PUT /api/crops/:id - Update a crop
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify ownership via farm
    const existingCrop = await prisma.crop.findFirst({
      where: { 
        id,
        farm: { ownerId: req.user.id }
      }
    });

    if (!existingCrop) {
      return res.status(404).json({ error: 'Crop not found or access denied' });
    }

    const updatedCrop = await prisma.crop.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    res.json(updatedCrop);
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Failed to update crop' });
  }
});

// DELETE /api/crops/:id - Delete a crop
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const existingCrop = await prisma.crop.findFirst({
      where: { 
        id,
        farm: { ownerId: req.user.id }
      }
    });

    if (!existingCrop) {
      return res.status(404).json({ error: 'Crop not found or access denied' });
    }

    await prisma.crop.delete({
      where: { id }
    });

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Failed to delete crop' });
  }
});

export default router;
