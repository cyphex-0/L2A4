import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CategoryService } from './category.service';
import sendResponse from '../../utils/sendResponse';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const CategoryController = {
  getAllCategories,
};
