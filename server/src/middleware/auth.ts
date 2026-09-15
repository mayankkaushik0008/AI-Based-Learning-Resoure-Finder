import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new AppError('JWT_SECRET must be configured in production', 500);
  }
  return secret || 'development-only-secret';
};

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Not authorized, invalid token', 401));
  }
};

export const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return next(new AppError('Access denied. Admin only.', 403));
  }
  next();
};
