import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createReview = async (payload: any, tenantId: string) => {
  const { propertyId, rating, comment } = payload;

  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId,
      status: 'COMPLETED',
    },
  });

  if (!completedRental) {
    throw new Error('You can only review properties you have successfully rented');
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId,
      tenantId,
    }
  });

  if (existingReview) {
    throw new Error('You have already reviewed this property');
  }

  const result = await prisma.review.create({
    data: {
      propertyId,
      tenantId,
      rating,
      comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    }
  });

  return result;
};

export const ReviewService = {
  createReview,
};
