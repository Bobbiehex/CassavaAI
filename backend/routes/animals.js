import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/animals - Get all animals for the user's farms
router.get('/', requireAuth, async (req, res) => {
  console.log(`[BACKEND] GET /api/animals - User: ${req.user.email}`);
  try {
    const { farmId } = req.query;
    
    const where = {};
    if (farmId) {
      where.farmId = farmId;
    } else {
      // If no farmId, get all animals for all farms owned by the user
      const userFarms = await prisma.farm.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      where.farmId = { in: userFarms.map(f => f.id) };
    }

    const animals = await prisma.animal.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

// POST /api/animals - Create a new animal
router.post('/', requireAuth, async (req, res) => {
  try {
    const { 
      species, breed, tagId, ageMonths, weightKg, temperature, 
      activityLevel, healthScore, status, lastCheckup, imageUrl, 
      location, locationHistory, farmId 
    } = req.body;

    if (!species || !tagId || !farmId) {
      return res.status(400).json({ error: 'Species, tagId, and farmId are required' });
    }

    // Verify farm ownership
    const farm = await prisma.farm.findFirst({
      where: { id: farmId, ownerId: req.user.id }
    });

    if (!farm) {
      return res.status(403).json({ error: 'Access denied to this farm' });
    }

    const animal = await prisma.animal.create({
      data: {
        species, breed, tagId, 
        ageMonths: ageMonths || 0, 
        weightKg: weightKg || 0, 
        temperature: temperature || 38.5, 
        activityLevel: activityLevel || 'Resting', 
        healthScore: healthScore || 100, 
        status: status || 'HEALTHY', 
        lastCheckup: lastCheckup || new Date().toISOString().split('T')[0], 
        imageUrl, 
        location: location || null, 
        locationHistory: locationHistory || [], 
        farmId
      }
    });

    res.status(201).json(animal);
  } catch (error) {
    console.error('Create animal error:', error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// PUT /api/animals/:id - Update an animal
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify ownership via farm
    const existingAnimal = await prisma.animal.findFirst({
      where: { 
        id,
        farm: { ownerId: req.user.id }
      }
    });

    if (!existingAnimal) {
      return res.status(404).json({ error: 'Animal not found or access denied' });
    }

    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    res.json(updatedAnimal);
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({ error: 'Failed to update animal' });
  }
});

// DELETE /api/animals/:id - Delete an animal
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const existingAnimal = await prisma.animal.findFirst({
      where: { 
        id,
        farm: { ownerId: req.user.id }
      }
    });

    if (!existingAnimal) {
      return res.status(404).json({ error: 'Animal not found or access denied' });
    }

    await prisma.animal.delete({
      where: { id }
    });

    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Delete animal error:', error);
    res.status(500).json({ error: 'Failed to delete animal' });
  }
});

export default router;
