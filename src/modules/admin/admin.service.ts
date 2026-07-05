import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const banUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { status: 'BANNED' },
  });
  return result;
};

const unbanUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });
  return result;
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
};
