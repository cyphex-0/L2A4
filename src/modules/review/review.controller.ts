import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ReviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.body, req.user!.userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
};
