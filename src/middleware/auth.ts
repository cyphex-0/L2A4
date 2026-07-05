import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../config';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';

const prisma = new PrismaClient();

const verifyJWT = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError(401, 'You are not authorized');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }

  const { userId, role, email } = decoded;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(401, 'User not found');
  }

  if (user.isBanned) {
    throw new AppError(403, 'Your account has been banned');
  }

  req.user = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  next();
});

export default verifyJWT;
