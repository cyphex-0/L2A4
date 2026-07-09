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

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.body;

  const result = await PaymentService.confirmPayment(paymentId, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment confirmed successfully',
    data: result,
  });
});

const simulatePayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.body;

  const result = await PaymentService.simulatePayment(paymentId, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment simulated and confirmed successfully',
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

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentById(req.params.id as string, req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment details retrieved successfully',
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
  confirmPayment,
  simulatePayment,
  getPaymentHistory,
  getPaymentById,
  stripeWebhook,
};
