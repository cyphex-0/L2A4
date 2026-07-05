import { z } from 'zod';

const createPaymentIntentSchema = z.object({
  body: z.object({
    rentalRequestId: z.string({ message: 'Rental Request ID is required' }),
  }),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
};
