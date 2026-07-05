import { z } from 'zod';

const createRentalRequestSchema = z.object({
  body: z.object({
    propertyId: z.string({ message: 'Property ID is required' }),
    moveInDate: z.string({ message: 'Move in date is required' }),
    moveOutDate: z.string({ message: 'Move out date is required' }),
    message: z.string().optional(),
  }),
});

export const RentalValidation = {
  createRentalRequestSchema,
};
