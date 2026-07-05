import express from 'express';
import { PropertyController } from './property.controller';
import verifyJWT from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import validateRequest from '../../middleware/validateRequest';
import { PropertyValidation } from './property.validation';
import { Role } from '@prisma/client';

const router = express.Router();

import { uuidParamValidation } from '../../middleware/uuidValidation';

router.get('/', validateRequest(PropertyValidation.getPropertiesSchema), PropertyController.getAllProperties);
router.get('/:id', validateRequest(uuidParamValidation), PropertyController.getPropertyById);

export const PropertyRoutes = router;
