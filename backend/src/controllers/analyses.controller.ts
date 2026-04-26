import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler';
import { uploadFile } from '../services/storage.service';
import { addAnalysisJob } from '../services/queue.service';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

function getFormatAndPlatform(filename: string): { format: string; platform: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (['ipa', 'app', 'xcarchive', 'dsym'].includes(ext)) {
    return { format: ext, platform: 'ios' };
  }
  if (['apk', 'aab'].includes(ext)) {
    return { format: ext, platform: 'android' };
  }

  throw new Error(`Unsupported format: ${ext}`);
}

export const uploadAnalysis = async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.file) {
      const error: AppError = new Error('No file provided');
      error.status = 400;
      error.code = 'NO_FILE';
      return next(error);
    }

    const { format, platform } = getFormatAndPlatform(req.file.originalname);

    // Validate file size (max 500MB)
    if (req.file.size > 500 * 1024 * 1024) {
      const error: AppError = new Error('File too large (max 500MB)');
      error.status = 413;
      error.code = 'FILE_TOO_LARGE';
      return next(error);
    }

    // Upload to S3/R2
    const fileKey = await uploadFile(req.file, req.userId!);

    // Create analysis record
    const analysisId = uuid();
    const analysis = await prisma.analysis.create({
      data: {
        id: analysisId,
        userId: req.userId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        format,
        platform,
        status: 'queued',
        fileR2Key: fileKey,
      },
    });

    // Add to queue
    await addAnalysisJob({
      analysisId,
      userId: req.userId!,
      fileKey,
      fileName: req.file.originalname,
      format,
      platform,
    });

    res.status(202).json({
      id: analysis.id,
      fileName: analysis.fileName,
      format: analysis.format,
      platform: analysis.platform,
      status: analysis.status,
      createdAt: analysis.createdAt,
    });
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
