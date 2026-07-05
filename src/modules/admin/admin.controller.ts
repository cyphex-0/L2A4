import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AdminService } from './admin.service';
import sendResponse from '../../utils/sendResponse';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { isBanned } = req.body;
  
  let result;
  if (isBanned) {
    result = await AdminService.banUser(req.params.id as string, req.user!.userId);
  } else {
    result = await AdminService.unbanUser(req.params.id as string);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllProperties();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateProperty(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteProperty(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllRentals();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  updateProperty,
  deleteProperty,
  getAllRentals,
};
