import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { AppError } from '../errors/AppError';
import handleZodError from '../errors/handleZodError';
import { Prisma } from '@prisma/client';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errorDetails: any = err;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = 'Database error';
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate entry found';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: config.env === 'development' ? errorDetails : null,
  });
};

export default globalErrorHandler;
