import express from 'express';
import { CategoryController } from './category.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { CategoryValidation } from './category.validation';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);

router.post(
  '/',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.put(
  '/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
