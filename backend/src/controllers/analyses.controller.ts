import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler';

const prisma = new PrismaClient();

export const uploadAnalysis = async (req: AuthRequest, res: Response, next) => {
  try {
    // TODO: File upload handler
    // For now, return placeholder
    res.status(501).json({ error: 'File upload not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const getAnalyses = async (req: AuthRequest, res: Response, next) => {
  try {
    const { limit = '10', offset = '0' } = req.query;

    const analyses = await prisma.analysis.findMany({
      where: { userId: req.userId },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    });

    res.json(analyses);
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!analysis) {
      const error: AppError = new Error('Analysis not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      return next(error);
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!analysis) {
      const error: AppError = new Error('Analysis not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      return next(error);
    }

    await prisma.analysis.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
