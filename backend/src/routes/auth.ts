import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

export const authRoutes = Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/logout', (req, res) => {
  // Token invalidation handled client-side for MVP
  res.json({ success: true });
});
