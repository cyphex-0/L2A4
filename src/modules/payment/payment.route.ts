import express from 'express';
import { PaymentController } from './payment.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

const router = express.Router();

import validateRequest from '../../middleware/validateRequest';
import { PaymentValidation } from './payment.validation';
import { uuidParamValidation } from '../../middleware/uuidValidation';

router.post(
  '/create',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(PaymentValidation.createPaymentIntentSchema),
  PaymentController.createPaymentIntent
);

router.post(
  '/confirm',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(PaymentValidation.confirmPaymentSchema),
  PaymentController.confirmPayment
);

router.post(
  '/simulate-pay',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(PaymentValidation.confirmPaymentSchema), // We can reuse confirmPaymentSchema since it just takes paymentId
  PaymentController.simulatePayment
);

router.get(
  '/',
  verifyJWT,
  authorize(Role.TENANT),
  PaymentController.getPaymentHistory
);

router.get(
  '/:id',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(uuidParamValidation),
  PaymentController.getPaymentById
);

export const PaymentRoutes = router;
