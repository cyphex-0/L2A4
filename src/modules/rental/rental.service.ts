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

export const RentalService = {
  createRentalRequest,
  getTenantRequests,
};
