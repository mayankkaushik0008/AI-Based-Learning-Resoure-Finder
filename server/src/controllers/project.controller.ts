import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: {
            savedResources: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        learningPath: {
          include: {
            items: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            savedResources: true,
            searchHistory: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      domain,
      technologies,
      skillLevel,
      projectType,
      currentStage,
      goals,
      deadline,
    } = req.body;

    // Validation
    if (!title || !description || !domain) {
      throw new AppError('Title, description, and domain are required', 400);
    }

    const project = await prisma.project.create({
      data: {
        userId: req.user!.id,
        title,
        description,
        domain,
        technologies: technologies || [],
        skillLevel: skillLevel || 'BEGINNER',
        projectType: projectType || 'PERSONAL',
        currentStage: currentStage || 'IDEA',
        goals,
        deadline: deadline ? new Date(deadline) : null,
        progress: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      domain,
      technologies,
      skillLevel,
      projectType,
      currentStage,
      goals,
      deadline,
      progress,
    } = req.body;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!existingProject) {
      throw new AppError('Project not found', 404);
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(domain && { domain }),
        ...(technologies && { technologies }),
        ...(skillLevel && { skillLevel }),
        ...(projectType && { projectType }),
        ...(currentStage && { currentStage }),
        ...(goals !== undefined && { goals }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(progress !== undefined && { progress }),
      },
    });

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { currentStage } = req.body;

    if (!currentStage) {
      throw new AppError('Current stage is required', 400);
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { currentStage },
    });

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project stage updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalSavedResources,
      totalSearches,
    ] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.project.count({
        where: {
          userId,
          currentStage: { notIn: ['PRESENTATION'] },
        },
      }),
      prisma.project.count({
        where: {
          userId,
          currentStage: 'PRESENTATION',
        },
      }),
      prisma.savedResource.count({ where: { userId } }),
      prisma.searchHistory.count({ where: { userId } }),
    ]);

    // Calculate average progress
    const projects = await prisma.project.findMany({
      where: { userId },
      select: { progress: true },
    });

    const averageProgress =
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
          )
        : 0;

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalSavedResources,
        totalSearches,
        averageProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};
