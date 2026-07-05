import { z } from 'zod';

export const uuidParamValidation = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid UUID format' }),
  }),
});
