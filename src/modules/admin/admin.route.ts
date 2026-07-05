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

router.get(
  '/properties',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllProperties
);

router.put(
  '/properties/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.updateProperty
);

router.delete(
  '/properties/:id',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.deleteProperty
);

router.get(
  '/rentals',
  verifyJWT,
  authorize(Role.ADMIN),
  AdminController.getAllRentals
);

export const AdminRoutes = router;
