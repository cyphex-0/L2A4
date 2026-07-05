import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

export const CategoryService = {
  getAllCategories,
};
