import { z } from 'zod';

const createPropertySchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    description: z.string({ message: 'Description is required' }),
    location: z.string({ message: 'Location is required' }),
    address: z.string({ message: 'Address is required' }),
    rent: z.number({ message: 'Rent is required' }).positive('Rent must be a positive number'),
    bedrooms: z.number({ message: 'Bedrooms is required' }).min(1),
    bathrooms: z.number({ message: 'Bathrooms is required' }).min(1),
    area: z.number({ message: 'Area is required' }),
    amenities: z.array(z.string()).nonempty('At least one amenity is required'),
    images: z.array(z.string()).nonempty('At least one image is required'),
    categoryId: z.string({ message: 'Category ID is required' }),
  }),
});

const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    rent: z.number().positive('Rent must be a positive number').optional(),
    bedrooms: z.number().min(1).optional(),
    bathrooms: z.number().min(1).optional(),
    area: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).optional(),
  }),
});

const getPropertiesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    bedrooms: z.string().optional(),
    location: z.string().optional(),
    categoryId: z.string().optional(),
    amenities: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
  }),
});

export const PropertyValidation = {
  createPropertySchema,
  updatePropertySchema,
  getPropertiesSchema,
};
