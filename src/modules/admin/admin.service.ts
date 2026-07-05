import { PrismaClient } from '@prisma/client';
import { AppError } from '../../errors/AppError';

const prisma = new PrismaClient();

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const banUser = async (id: string, adminId: string) => {
  if (id === adminId) {
    throw new AppError(400, 'You cannot ban yourself');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!targetUser) {
    throw new AppError(404, 'User not found');
  }

  if (targetUser.role === 'ADMIN') {
    throw new AppError(403, 'Cannot ban another admin');
  }
  
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const unbanUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    }
  });
  return result;
};

const updateProperty = async (id: string, payload: any) => {
  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteProperty = async (id: string) => {
  const result = await prisma.property.delete({
    where: { id },
  });
  return result;
};

const getAllRentals = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    }
  });
  return result;
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
  getAllProperties,
  updateProperty,
  deleteProperty,
  getAllRentals,
};
