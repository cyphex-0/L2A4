import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRentalRequest = async (payload: any, tenantId: string) => {
  const result = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId,
      moveInDate: new Date(payload.moveInDate),
      moveOutDate: new Date(payload.moveOutDate),
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

const getLandlordRequests = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      }
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          phone: true,
        }
      }
    }
  });

  return result;
};

const updateRequestStatus = async (id: string, landlordId: string, status: 'APPROVED' | 'REJECTED') => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true }
  });

  if (!request) {
    throw new Error('Rental request not found');
  }

  if (request.property.landlordId !== landlordId) {
    throw new Error('You are not authorized to update this request');
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: { status },
  });

  return result;
};

export const RentalService = {
  createRentalRequest,
  getTenantRequests,
  getLandlordRequests,
  updateRequestStatus,
};
