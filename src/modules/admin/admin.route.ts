import express from 'express';
import { AdminController } from './admin.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

import { uuidParamValidation } from '../../middleware/uuidValidation';

const router = express.Router();

router.get(
  '/users',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllUsers
);

router.put(
  '/users/:id/ban',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  AdminController.banUser
);

router.put(
  '/users/:id/unban',
  verifyJWT,
  authorize(Role.ADMIN),
  validateRequest(uuidParamValidation),
  AdminController.unbanUser
);

router.get(
  '/properties',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllProperties
);

import validateRequest from '../../middleware/validateRequest';
import { PropertyValidation } from '../property/property.validation';

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

export const AdminRoutes = router;
