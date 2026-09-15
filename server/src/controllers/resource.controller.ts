import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { analyzeProject } from '../services/aiService';
import { searchResources } from '../services/resourceSearchService';
import { SearchQuery } from '../types/resource.types';

export const searchResourcesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      projectId,
      customQuery,
      stage,
      skillLevel,
      preferredTypes,
      filters,
    } = req.body;

    let searchQuery: SearchQuery;

    if (projectId) {
      // Search based on project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.user!.id,
        },
      });

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      // Analyze project with AI
      const analysis = await analyzeProject(
        project.title,
        project.description,
        project.domain,
        project.technologies,
        project.skillLevel,
        project.currentStage
      );

      searchQuery = {
        topic: analysis.mainTopic,
        subtopics: analysis.subtopics,
        technologies: analysis.technologies,
        skills: analysis.requiredSkills,
        stage: stage || project.currentStage,
        skillLevel: skillLevel || project.skillLevel as any,
        keywords: analysis.searchKeywords,
        preferredTypes: preferredTypes || analysis.recommendedResourceTypes as any,
      };

      // Save search history
      await prisma.searchHistory.create({
        data: {
          userId: req.user!.id,
          projectId: project.id,
          query: `${project.title}: ${analysis.mainTopic}`,
          stage: searchQuery.stage,
          skillLevel: searchQuery.skillLevel,
          filters: filters || {},
          resultsCount: 0, // Will update after search
        },
      });
    } else if (customQuery) {
      // Custom search query
      searchQuery = {
        topic: customQuery,
        subtopics: [],
        technologies: [],
        skills: [],
        stage: stage || 'LEARNING',
        skillLevel: skillLevel || 'INTERMEDIATE' as any,
        keywords: customQuery.split(' '),
        preferredTypes,
      };

      // Save search history
      await prisma.searchHistory.create({
        data: {
          userId: req.user!.id,
          query: customQuery,
          stage: searchQuery.stage,
          skillLevel: searchQuery.skillLevel,
          filters: filters || {},
          resultsCount: 0,
        },
      });
    } else {
      throw new AppError('Either projectId or customQuery is required', 400);
    }

    // Search resources
    const resources = await searchResources({
      query: searchQuery,
      filters,
      limit: 30,
    });

    // Cache resources in database for future reference
    for (const resource of resources.slice(0, 10)) {
      try {
        await prisma.resource.upsert({
          where: {
            source_externalId: {
              source: resource.source,
              externalId: resource.externalId || resource.url,
            },
          },
          update: {
            title: resource.title,
            description: resource.description,
            url: resource.url,
            credibilityScore: resource.credibilityScore,
            popularityScore: resource.popularityScore,
          },
          create: {
            title: resource.title,
            description: resource.description,
            url: resource.url,
            type: resource.type,
            source: resource.source,
            author: resource.author,
            thumbnail: resource.thumbnail,
            publishedDate: resource.publishedDate,
            topics: resource.topics,
            difficulty: resource.difficulty,
            credibilityScore: resource.credibilityScore,
            popularityScore: resource.popularityScore,
            externalId: resource.externalId || resource.url,
            language: resource.language,
          },
        });
      } catch (cacheError) {
        // Ignore cache errors, continue with search
        console.error('Resource caching error:', cacheError);
      }
    }

    res.json({
      success: true,
      data: {
        resources,
        query: searchQuery,
        totalResults: resources.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resourceId, projectId, collectionId, notes } = req.body;

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check if already saved
    const existing = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: req.user!.id,
          resourceId,
        },
      },
    });

    if (existing) {
      throw new AppError('Resource already saved', 400);
    }

    // Save resource
    const savedResource = await prisma.savedResource.create({
      data: {
        userId: req.user!.id,
        resourceId,
        projectId,
        collectionId,
        notes,
      },
      include: {
        resource: true,
      },
    });

    // Track interaction
    await prisma.resourceInteraction.create({
      data: {
        userId: req.user!.id,
        resourceId,
        action: 'SAVE',
      },
    });

    res.json({
      success: true,
      data: savedResource,
      message: 'Resource saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resourceId } = req.body;

    const savedResource = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: req.user!.id,
          resourceId,
        },
      },
    });

    if (!savedResource) {
      throw new AppError('Resource not found in saved items', 404);
    }

    await prisma.savedResource.delete({
      where: {
        id: savedResource.id,
      },
    });

    // Track interaction
    await prisma.resourceInteraction.create({
      data: {
        userId: req.user!.id,
        resourceId,
        action: 'UNSAVE',
      },
    });

    res.json({
      success: true,
      message: 'Resource removed from saved items',
    });
  } catch (error) {
    next(error);
  }
};

export const rateResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resourceId, rating, feedback, isUseful } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Upsert rating
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_resourceId: {
          userId: req.user!.id,
          resourceId,
        },
      },
      update: {
        rating,
        feedback,
        isUseful,
      },
      create: {
        userId: req.user!.id,
        resourceId,
        rating,
        feedback,
        isUseful,
      },
    });

    // Track interaction
    await prisma.resourceInteraction.create({
      data: {
        userId: req.user!.id,
        resourceId,
        action: 'RATE',
        metadata: { rating, isUseful },
      },
    });

    res.json({
      success: true,
      data: ratingRecord,
      message: 'Resource rated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, collectionId } = req.query;

    const where: any = {
      userId: req.user!.id,
    };

    if (projectId) where.projectId = projectId as string;
    if (collectionId) where.collectionId = collectionId as string;

    const savedResources = await prisma.savedResource.findMany({
      where,
      include: {
        resource: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: savedResources,
    });
  } catch (error) {
    next(error);
  }
};
