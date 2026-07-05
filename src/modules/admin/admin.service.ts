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
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  return result;
};

const banUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned: true },
  });
  return result;
};

const unbanUser = async (id: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned: false },
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
