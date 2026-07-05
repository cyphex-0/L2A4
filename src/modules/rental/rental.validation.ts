import { z } from 'zod';

const createRentalRequestSchema = z.object({
  body: z.object({
    propertyId: z.string({ message: 'Property ID is required' }),
    moveInDate: z.string({ message: 'Move in date is required' }).refine((val) => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), {
      message: 'Move in date cannot be in the past',
    }),
    moveOutDate: z.string({ message: 'Move out date is required' }),
    message: z.string().optional(),
  }),
});

const updateRentalRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED'], {
      message: 'Status must be APPROVED or REJECTED',
    }),
  }),
});

export const RentalValidation = {
  createRentalRequestSchema,
  updateRentalRequestStatusSchema,
};
