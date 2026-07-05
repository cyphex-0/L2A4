import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError';

const prisma = new PrismaClient();

const getAllProperties = async (filters: any, options: any) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  const skip = (page - 1) * limit;

  const { search, minPrice, maxPrice, bedrooms, location, categoryId } = filters;

  const andConditions: Prisma.PropertyWhereInput[] = [
    { status: 'AVAILABLE' }
  ];

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (minPrice !== undefined) {
    andConditions.push({ rent: { gte: minPrice } });
  }

  if (maxPrice !== undefined) {
    andConditions.push({ rent: { lte: maxPrice } });
  }

  if (bedrooms !== undefined) {
    andConditions.push({ bedrooms: parseInt(bedrooms) });
  }

  if (location) {
    andConditions.push({ location: { contains: location, mode: 'insensitive' } });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (filters.amenities) {
    const amenitiesList = filters.amenities.split(',').map((a: string) => a.trim());
    andConditions.push({ amenities: { hasSome: amenitiesList } });
  }

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: parseInt(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.property.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
    data: result,
  };
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  return property;
};



export const PropertyService = {
  getAllProperties,
  getPropertyById,
};
