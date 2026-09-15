import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { analyzeProject, chatWithAI } from '../services/aiService';

export const analyzeProjectController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.body;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const analysis = await analyzeProject(
      project.title,
      project.description,
      project.domain,
      project.technologies,
      project.skillLevel,
      project.currentStage
    );

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const chatController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, projectId } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    let projectContext = '';
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.user!.id,
        },
      });

      if (project) {
        projectContext = `User is working on: ${project.title}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Current stage: ${project.currentStage}.`;
      }
    }

    // Get recent chat history
    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        userId: req.user!.id,
        ...(projectId && { projectId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const conversationHistory = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Get AI response
    const aiResponse = await chatWithAI(message, conversationHistory, projectContext);

    // Save messages
    await Promise.all([
      prisma.chatMessage.create({
        data: {
          userId: req.user!.id,
          projectId,
          role: 'USER',
          content: message,
        },
      }),
      prisma.chatMessage.create({
        data: {
          userId: req.user!.id,
          projectId,
          role: 'ASSISTANT',
          content: aiResponse,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        message: aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, limit = 50 } = req.query;

    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: req.user!.id,
        ...(projectId && { projectId: projectId as string }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
    });

    res.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};
