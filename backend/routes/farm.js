import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads/farms');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'farm-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/farms - Get all farms for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const farms = await prisma.farm.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(farms);
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// GET /api/farms/:id - Get a specific farm
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await prisma.farm.findFirst({
      where: { id, ownerId: req.user.id }
    });
    
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    
    res.json(farm);
  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({ error: 'Failed to fetch farm' });
  }
});

// POST /api/farms - Create a new farm
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, location, coordinates, totalArea, image, manualMetrics } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        coordinates: coordinates ? (typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates) : null,
        totalArea: totalArea ? parseFloat(totalArea) : null,
        image,
        manualMetrics: manualMetrics ? (typeof manualMetrics === 'string' ? JSON.parse(manualMetrics) : manualMetrics) : null,
        ownerId: req.user.id
      }
    });

    res.status(201).json(farm);
  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// PUT /api/farms/:id - Update a farm
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, coordinates, totalArea, image, manualMetrics, soilHistory } = req.body;

    // Check if farm belongs to user
    const existingFarm = await prisma.farm.findFirst({
      where: { id, ownerId: req.user.id }
    });

    if (!existingFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    const updateData = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (coordinates !== undefined) {
      updateData.coordinates = coordinates ? (typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates) : null;
    }
    if (totalArea !== undefined) {
      updateData.totalArea = totalArea ? parseFloat(totalArea) : null;
    }
    if (image !== undefined) updateData.image = image;
    if (manualMetrics !== undefined) {
      updateData.manualMetrics = manualMetrics ? (typeof manualMetrics === 'string' ? JSON.parse(manualMetrics) : manualMetrics) : null;
    }
    if (soilHistory !== undefined) {
      updateData.soilHistory = soilHistory ? (typeof soilHistory === 'string' ? JSON.parse(soilHistory) : soilHistory) : null;
    }

    const updatedFarm = await prisma.farm.update({
      where: { id },
      data: updateData
    });

    res.json(updatedFarm);
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({ error: 'Failed to update farm' });
  }
});

// DELETE /api/farms/:id - Delete a farm
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if farm belongs to user
    const existingFarm = await prisma.farm.findFirst({
      where: { id, ownerId: req.user.id }
    });

    if (!existingFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    await prisma.farm.delete({
      where: { id }
    });

    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({ error: 'Failed to delete farm' });
  }
});

// POST /api/farms/:id/avatar - Upload farm avatar
router.post('/:id/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if farm belongs to user
    const existingFarm = await prisma.farm.findFirst({
      where: { id, ownerId: req.user.id }
    });

    if (!existingFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/farms/${req.file.filename}`;

    const updatedFarm = await prisma.farm.update({
      where: { id },
      data: {
        image: avatarUrl,
        updatedAt: new Date()
      }
    });

    res.json({ farm: updatedFarm, avatarUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

export default router;