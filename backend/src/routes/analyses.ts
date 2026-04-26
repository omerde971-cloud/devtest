import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth';
import {
  uploadAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
} from '../controllers/analyses.controller';

export const analysesRoutes = Router();

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// All routes require auth
analysesRoutes.use(verifyToken);

analysesRoutes.post('/upload', upload.single('file'), uploadAnalysis);
analysesRoutes.get('/', getAnalyses);
analysesRoutes.get('/:id', getAnalysis);
analysesRoutes.delete('/:id', deleteAnalysis);
