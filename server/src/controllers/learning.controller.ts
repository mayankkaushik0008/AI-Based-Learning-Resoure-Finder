import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateLearningPath as generateLearningPathAI } from '../services/aiService';

export const getLearningPath = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const learningPath = await prisma.learningPath.findUnique({
      where: { projectId },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: learningPath,
    });
  } catch (error) {
    next(error);
  }
};

export const generateLearningPath = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if learning path already exists
    const existing = await prisma.learningPath.findUnique({
      where: { projectId },
    });

    if (existing) {
      throw new AppError('Learning path already exists for this project', 400);
    }

    // Generate learning path with AI
    const pathItems = await generateLearningPathAI(
      project.title,
      project.description,
      project.technologies,
      project.skillLevel
    );

    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        projectId: project.id,
        title: `Learning Path for ${project.title}`,
        description: `Step-by-step learning path to master the concepts needed for ${project.title}`,
        items: {
          create: pathItems.map((item) => ({
            title: item.title,
            description: item.description,
            order: item.order,
            isCompleted: false,
            resources: [],
          })),
        },
      },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: learningPath,
      message: 'Learning path generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const completeLearningPathItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const { isCompleted } = req.body;

    // Find the item and verify ownership
    const item = await prisma.learningPathItem.findUnique({
      where: { id: itemId },
      include: {
        learningPath: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError('Learning path item not found', 404);
    }

    if (item.learningPath.project.userId !== req.user!.id) {
      throw new AppError('Not authorized', 403);
    }

    // Update completion status
    const updatedItem = await prisma.learningPathItem.update({
      where: { id: itemId },
      data: { isCompleted: isCompleted !== undefined ? isCompleted : !item.isCompleted },
    });

    // Calculate overall progress
    const allItems = await prisma.learningPathItem.findMany({
      where: { learningPathId: item.learningPathId },
    });

    const completedCount = allItems.filter((i) => i.isCompleted).length;
    const progress = Math.round((completedCount / allItems.length) * 100);

    // Update project progress
    await prisma.project.update({
      where: { id: item.learningPath.projectId },
      data: { progress },
    });

    res.json({
      success: true,
      data: {
        item: updatedItem,
        progress,
      },
      message: `Item marked as ${updatedItem.isCompleted ? 'completed' : 'incomplete'}`,
    });
  } catch (error) {
    next(error);
  }
};
