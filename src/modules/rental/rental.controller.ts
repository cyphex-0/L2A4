import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { RentalService } from './rental.service';
import sendResponse from '../../utils/sendResponse';

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.createRentalRequest(req.body, req.user!.userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rental request submitted successfully',
    data: result,
  });
});

const getTenantRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getTenantRequests(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

export const RentalController = {
  createRentalRequest,
  getTenantRequests,
};
