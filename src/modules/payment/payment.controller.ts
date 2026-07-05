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

const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentHistory(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const payload = req.body;

  const result = await PaymentService.handleWebhook(payload, signature);

  res.status(200).json(result);
});

export const PaymentController = {
  createPaymentIntent,
  getPaymentHistory,
  stripeWebhook,
};
