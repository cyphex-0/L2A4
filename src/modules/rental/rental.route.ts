import express from 'express';
import { RentalController } from './rental.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { RentalValidation } from './rental.validation';
import { Role } from '@prisma/client';

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

export const RentalRoutes = router;
