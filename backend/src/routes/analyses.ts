import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  uploadAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
} from '../controllers/analyses.controller';

export const analysesRoutes = Router();

// All routes require auth
analysesRoutes.use(verifyToken);

analysesRoutes.post('/upload', uploadAnalysis);
analysesRoutes.get('/', getAnalyses);
analysesRoutes.get('/:id', getAnalysis);
analysesRoutes.delete('/:id', deleteAnalysis);
