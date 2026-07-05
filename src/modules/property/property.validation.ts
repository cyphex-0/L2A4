import { z } from 'zod';

const createPropertySchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    location: z.string({ required_error: 'Location is required' }),
    address: z.string({ required_error: 'Address is required' }),
    rent: z.number({ required_error: 'Rent is required' }).min(0),
    bedrooms: z.number({ required_error: 'Bedrooms is required' }).min(1),
    bathrooms: z.number({ required_error: 'Bathrooms is required' }).min(1),
    area: z.number({ required_error: 'Area is required' }),
    amenities: z.array(z.string()).nonempty('At least one amenity is required'),
    images: z.array(z.string()).nonempty('At least one image is required'),
    categoryId: z.string({ required_error: 'Category ID is required' }),
  }),
});

const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    rent: z.number().min(0).optional(),
    bedrooms: z.number().min(1).optional(),
    bathrooms: z.number().min(1).optional(),
    area: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
  }),
});

export const PropertyValidation = {
  createPropertySchema,
  updatePropertySchema,
};
