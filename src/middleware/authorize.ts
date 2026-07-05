import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../errors/AppError';

const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'You are not authorized'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }

    next();
  };
};

export default authorize;
