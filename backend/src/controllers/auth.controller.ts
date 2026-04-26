import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler';

const prisma = new PrismaClient();

const generateTokens = (userId: string) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET || 'refresh-secret',
    { expiresIn: '30d' }
  );

  return { token, refreshToken };
};

export const registerUser = async (req: Request, res: Response, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      const error: AppError = new Error('Email and password required');
      error.status = 400;
      error.code = 'INVALID_INPUT';
      return next(error);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error: AppError = new Error('Email already registered');
      error.status = 409;
      error.code = 'EMAIL_EXISTS';
      return next(error);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        subscription: {
          create: {
            plan: 'free',
            status: 'active',
          },
        },
      },
    });

    const { token, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: AppError = new Error('Email and password required');
      error.status = 400;
      error.code = 'INVALID_INPUT';
      return next(error);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash || ''
    );

    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid password');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    const { token, refreshToken } = generateTokens(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
