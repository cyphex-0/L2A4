import express from 'express';
import { PaymentController } from './payment.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

const router = express.Router();

import validateRequest from '../../middleware/validateRequest';
import { PaymentValidation } from './payment.validation';

router.post(
  '/create-intent',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(PaymentValidation.createPaymentIntentSchema),
  PaymentController.createPaymentIntent
);

router.get(
  '/history',
  verifyJWT,
  authorize(Role.TENANT),
  PaymentController.getPaymentHistory
);

export const PaymentRoutes = router;
