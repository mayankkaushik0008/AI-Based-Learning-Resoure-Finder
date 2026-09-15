import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAdminStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalSearches,
      totalSavedResources,
      totalRatings,
      recentUsers,
      recentProjects,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.searchHistory.count(),
      prisma.savedResource.count(),
      prisma.rating.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.project.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Get popular topics
    const projects = await prisma.project.findMany({
      select: { domain: true },
    });

    const topicCounts: Record<string, number> = {};
    projects.forEach((p) => {
      topicCounts[p.domain] = (topicCounts[p.domain] || 0) + 1;
    });

    const popularTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    // Get resource type distribution
    const resources = await prisma.resource.groupBy({
      by: ['type'],
      _count: true,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProjects,
          totalSearches,
          totalSavedResources,
          totalRatings,
          recentUsers,
          recentProjects,
        },
        popularTopics,
        resourceTypes: resources.map((r) => ({
          type: r.type,
          count: r._count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          educationLevel: true,
          fieldOfStudy: true,
          skillLevel: true,
          isAdmin: true,
          createdAt: true,
          _count: {
            select: {
              projects: true,
              savedResources: true,
              searchHistory: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = type ? { type: type as string } : {};

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          _count: {
            select: {
              savedBy: true,
              ratings: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resource.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        resources,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
