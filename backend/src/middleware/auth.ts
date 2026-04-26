import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error-handler';

export interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    const error: AppError = new Error('No token provided');
    error.status = 401;
    error.code = 'NO_TOKEN';
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    const error: AppError = new Error('Invalid token');
    error.status = 401;
    error.code = 'INVALID_TOKEN';
    next(error);
  }
};
