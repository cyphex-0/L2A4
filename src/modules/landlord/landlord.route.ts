import express from 'express';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { Role } from '@prisma/client';
import { uuidParamValidation } from '../../middleware/uuidValidation';

import { LandlordController } from './landlord.controller';
import { PropertyValidation } from '../property/property.validation';
import { RentalValidation } from '../rental/rental.validation';

const router = express.Router();

router.post(
  '/properties',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(PropertyValidation.createPropertySchema),
  LandlordController.createProperty
);

router.put(
  '/properties/:id',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  validateRequest(PropertyValidation.updatePropertySchema),
  LandlordController.updateProperty
);

router.delete(
  '/properties/:id',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  LandlordController.deleteProperty
);

router.get(
  '/properties',
  verifyJWT,
  authorize(Role.LANDLORD),
  LandlordController.getLandlordProperties
);

router.get(
  '/requests',
  verifyJWT,
  authorize(Role.LANDLORD),
  LandlordController.getLandlordRequests
);

router.patch(
  '/requests/:id',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  validateRequest(RentalValidation.updateRentalRequestStatusSchema),
  LandlordController.updateRequestStatus
);

router.patch(
  '/requests/:id/complete',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  LandlordController.completeRentalRequest
);

export const LandlordRoutes = router;
