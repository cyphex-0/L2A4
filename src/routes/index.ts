import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PropertyRoutes } from '../modules/property/property.route';
import { CategoryRoutes } from '../modules/category/category.route';

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
  {
    path: '/categories',
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
