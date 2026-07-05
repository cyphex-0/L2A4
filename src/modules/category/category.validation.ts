import { z } from 'zod';

const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ message: 'Category name is required' }),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
