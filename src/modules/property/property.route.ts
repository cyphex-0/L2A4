import express from 'express';
import { PropertyController } from './property.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { PropertyValidation } from './property.validation';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);

router.post(
  '/',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(PropertyValidation.createPropertySchema),
  PropertyController.createProperty
);

router.put(
  '/:id',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(PropertyValidation.updatePropertySchema),
  PropertyController.updateProperty
);

router.delete(
  '/:id',
  verifyJWT,
  authorize(Role.LANDLORD),
  PropertyController.deleteProperty
);

export const PropertyRoutes = router;
