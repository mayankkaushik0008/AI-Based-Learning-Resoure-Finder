import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getCollections = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: req.user!.id },
      include: { _count: { select: { resources: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: collections });
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, isPublic = false } = req.body;
    if (!name?.trim()) throw new AppError('Collection name is required', 400);
    const collection = await prisma.collection.create({
      data: { userId: req.user!.id, name: name.trim(), description, isPublic: Boolean(isPublic) },
    });
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { resources: { include: { resource: true }, orderBy: { createdAt: 'desc' } } },
    });
    if (!collection) throw new AppError('Collection not found', 404);
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      select: { id: true },
    });
    if (!collection) throw new AppError('Collection not found', 404);
    await prisma.collection.delete({ where: { id: collection.id } });
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    next(error);
  }
};
