import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const getRecommendations = async (userId: string, projectId?: string) => {
  const saved = await prisma.savedResource.findMany({
    where: { userId },
    select: { resourceId: true },
  });
  const excludedIds = saved.map((item) => item.resourceId);
  const project = projectId
    ? await prisma.project.findFirst({ where: { id: projectId, userId }, select: { domain: true, technologies: true } })
    : null;
  if (projectId && !project) throw new AppError('Project not found', 404);

  const candidates = await prisma.resource.findMany({
    where: { id: { notIn: excludedIds } },
    take: 50,
    orderBy: [{ credibilityScore: 'desc' }, { popularityScore: 'desc' }],
  });
  const terms = project ? [project.domain, ...project.technologies].map((term) => term.toLowerCase()) : [];
  return candidates
    .map((resource) => ({
      ...resource,
      matchScore: terms.length === 0 ? 0 : terms.filter((term) =>
        `${resource.title} ${resource.description ?? ''} ${resource.topics.join(' ')}`.toLowerCase().includes(term)
      ).length / terms.length,
    }))
    .sort((a, b) => b.matchScore - a.matchScore || b.credibilityScore - a.credibilityScore)
    .slice(0, 20);
};

export const getGeneralRecommendations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await getRecommendations(req.user!.id) });
  } catch (error) {
    next(error);
  }
};

export const getProjectRecommendations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await getRecommendations(req.user!.id, req.params.projectId) });
  } catch (error) {
    next(error);
  }
};
