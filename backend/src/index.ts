import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { errorHandler } from './middleware/error-handler';
import { authRoutes } from './routes/auth';
import { analysesRoutes } from './routes/analyses';
import { billingRoutes } from './routes/billing';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend build)
const staticPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(staticPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysesRoutes);
app.use('/api/billing', billingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(staticPath, 'index.html'));
  }
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ DevTest API running on http://localhost:${PORT}`);
});
