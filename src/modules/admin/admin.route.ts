import express from 'express';
import { AdminController } from './admin.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

import { uuidParamValidation } from '../../middleware/uuidValidation';
import validateRequest from '../../middleware/validateRequest';
import { PropertyValidation } from '../property/property.validation';
import { CategoryController } from '../category/category.controller';
import { CategoryValidation } from '../category/category.validation';
const router = express.Router();

router.get(
  '/users',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllUsers
);

import { AdminValidation } from './admin.validation';

router.patch(
  '/users/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  validateRequest(AdminValidation.updateUserStatusSchema),
  AdminController.updateUserStatus
);

router.get(
  '/properties',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllProperties
);


router.put(
  '/properties/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  validateRequest(PropertyValidation.updatePropertySchema),
  AdminController.updateProperty
);

router.delete(
  '/properties/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  AdminController.deleteProperty
);

router.get(
  '/rentals',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllRentals
);

router.post(
  '/categories',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.put(
  '/categories/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/categories/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  CategoryController.deleteCategory
);

export const AdminRoutes = router;
