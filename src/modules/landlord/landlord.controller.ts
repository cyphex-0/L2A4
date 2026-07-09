import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { LandlordService } from './landlord.service';
import sendResponse from '../../utils/sendResponse';

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.createProperty(req.body, req.user!.userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property created successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.updateProperty(req.params.id as string, req.body, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.deleteProperty(req.params.id as string, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
    data: result,
  });
});

const getLandlordProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getLandlordProperties(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Landlord properties retrieved successfully',
    data: result,
  });
});

const getLandlordRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getLandlordRequests(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await LandlordService.updateRequestStatus(req.params.id as string, req.user!.userId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental request status updated successfully',
    data: result,
  });
});

const completeRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.completeRentalRequest(req.params.id as string, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental completed successfully',
    data: result,
  });
});

export const LandlordController = {
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
  getLandlordRequests,
  updateRequestStatus,
  completeRentalRequest,
};
