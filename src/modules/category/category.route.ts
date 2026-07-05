import express from 'express';
import { CategoryController } from './category.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { CategoryValidation } from './category.validation';
import { Role } from '@prisma/client';

import { uuidParamValidation } from '../../middleware/uuidValidation';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes = router;
