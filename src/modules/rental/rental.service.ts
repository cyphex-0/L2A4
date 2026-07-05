import { PrismaClient } from '@prisma/client';
import { AppError } from '../../errors/AppError';

const prisma = new PrismaClient();

const createRentalRequest = async (payload: any, tenantId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new AppError(404, 'Property not found');
  }

  if (property.status !== 'AVAILABLE') {
    throw new AppError(400, 'Property is not available for rental');
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
    },
  });

  if (existingRequest) {
    throw new AppError(409, 'You already have an active or pending request for this property');
  }

  const moveInDate = new Date(payload.moveInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (moveInDate < today) {
    throw new AppError(400, 'Move-in date cannot be in the past');
  }

  const result = await prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      moveInDate: new Date(payload.moveInDate),
      moveOutDate: new Date(payload.moveOutDate),
      message: payload.message,
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  return result;
};

const getTenantRequests = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: true,
    }
  });

  return result;
};



const getRentalRequestById = async (id: string, userId: string, role: string) => {
  const result = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
    }
  });

  if (!result) {
    throw new AppError(404, 'Rental request not found');
  }

  if (role === 'TENANT' && result.tenantId !== userId) {
    throw new AppError(403, 'You do not have permission to view this request');
  }

  if (role === 'LANDLORD' && result.property.landlordId !== userId) {
    throw new AppError(403, 'You do not have permission to view this request');
  }

  return result;
};

export const RentalService = {
  createRentalRequest,
  getTenantRequests,
  getRentalRequestById,
};
