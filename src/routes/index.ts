import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PropertyRoutes } from '../modules/property/property.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/properties',
    route: PropertyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
