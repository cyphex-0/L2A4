import { z } from 'zod';

const updateUserStatusSchema = z.object({
  body: z.object({
    isBanned: z.boolean({
      message: 'isBanned status is required',
    }),
  }),
});

export const AdminValidation = {
  updateUserStatusSchema,
};
