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

const banUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.banUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User banned successfully',
    data: result,
  });
});

const unbanUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.unbanUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User unbanned successfully',
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  banUser,
  unbanUser,
};
