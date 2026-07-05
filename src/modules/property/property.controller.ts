import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PropertyService } from './property.service';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'minPrice', 'maxPrice', 'bedrooms', 'location']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await PropertyService.getAllProperties(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getPropertyById(req.params.id);

  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Property not found',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property details retrieved successfully',
    data: result,
  });
});

export const PropertyController = {
  getAllProperties,
  getPropertyById,
};
