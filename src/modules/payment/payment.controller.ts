import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../utils/sendResponse';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { rentalRequestId } = req.body;

  const result = await PaymentService.createPaymentIntent(rentalRequestId, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
};
