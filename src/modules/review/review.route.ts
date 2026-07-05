import express from 'express';
import { ReviewController } from './review.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';
import { Role } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  verifyJWT,
  authorize(Role.TENANT),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview
);

export const ReviewRoutes = router;
