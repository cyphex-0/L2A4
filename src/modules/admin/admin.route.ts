import express from 'express';
import { AdminController } from './admin.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { Role } from '@prisma/client';

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
  AdminController.banUser
);

router.put(
  '/users/:id/unban',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.unbanUser
);

export const AdminRoutes = router;
