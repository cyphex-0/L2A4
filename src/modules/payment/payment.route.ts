import express from 'express';
import { PaymentController } from './payment.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-intent',
  verifyJWT,
  authorize(Role.TENANT),
  PaymentController.createPaymentIntent
);

export const PaymentRoutes = router;
