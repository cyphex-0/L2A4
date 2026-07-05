import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

export const AuthService = {
  registerUser,
};
