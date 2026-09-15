import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string, email: string, isAdmin: boolean): string => {
  return jwt.sign(
    { id, email, isAdmin },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, educationLevel, fieldOfStudy } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      throw new AppError('Please provide email, password, and name', 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        educationLevel,
        fieldOfStudy,
      },
      select: {
        id: true,
        email: true,
        name: true,
        educationLevel: true,
        fieldOfStudy: true,
        skillLevel: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email, user.isAdmin);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.isAdmin);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        educationLevel: true,
        fieldOfStudy: true,
        skillLevel: true,
        interests: true,
        preferredResources: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, educationLevel, fieldOfStudy, skillLevel, interests, preferredResources } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(educationLevel && { educationLevel }),
        ...(fieldOfStudy && { fieldOfStudy }),
        ...(skillLevel && { skillLevel }),
        ...(interests && { interests }),
        ...(preferredResources && { preferredResources }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        educationLevel: true,
        fieldOfStudy: true,
        skillLevel: true,
        interests: true,
        preferredResources: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
