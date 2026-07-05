import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import verifyJWT from '../../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.get(
  '/me',
  verifyJWT,
  AuthController.getMe
);

router.post(
  '/refresh-token',
  AuthController.refreshToken
);

router.put(
  '/me',
  verifyJWT,
  validateRequest(AuthValidation.updateProfileSchema),
  AuthController.updateProfile
);

export const AuthRoutes = router;
