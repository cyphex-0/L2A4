import express from 'express';
import { RentalController } from './rental.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { RentalValidation } from './rental.validation';
import { Role } from '@prisma/client';

import { uuidParamValidation } from '../../middleware/uuidValidation';

const router = express.Router();

router.post(
  '/',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(RentalValidation.createRentalRequestSchema),
  RentalController.createRentalRequest
);

router.get(
  '/',
  verifyJWT,
  authorize(Role.TENANT),
  RentalController.getTenantRequests
);

router.get(
  '/:id',
  verifyJWT,
  authorize(Role.TENANT, Role.LANDLORD),
  validateRequest(uuidParamValidation),
  RentalController.getRentalRequestById
);

router.get(
  '/requests',
  verifyJWT,
  authorize(Role.LANDLORD),
  RentalController.getLandlordRequests
);

router.put(
  '/:id/status',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  validateRequest(RentalValidation.updateRentalRequestStatusSchema),
  RentalController.updateRequestStatus
);

router.put(
  '/:id/complete',
  verifyJWT,
  authorize(Role.LANDLORD),
  validateRequest(uuidParamValidation),
  RentalController.completeRentalRequest
);

export const RentalRoutes = router;
