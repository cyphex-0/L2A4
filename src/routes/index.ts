import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PropertyRoutes } from '../modules/property/property.route';
import { CategoryRoutes } from '../modules/category/category.route';

import { RentalRoutes } from '../modules/rental/rental.route';

import { PaymentRoutes } from '../modules/payment/payment.route';

import { ReviewRoutes } from '../modules/review/review.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { LandlordRoutes } from '../modules/landlord/landlord.route';

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
  {
    path: '/rentals',
    route: RentalRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/landlord',
    route: LandlordRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
