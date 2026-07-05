import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { AppError } from '../../errors/AppError';

const prisma = new PrismaClient();

const registerUser = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role as Role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return newUser;
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  if (user.isBanned) {
    throw new AppError(403, 'Your account has been banned');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.secret as string, {
    expiresIn: config.jwt.expires_in as any,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: accessToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      profileImage: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};
