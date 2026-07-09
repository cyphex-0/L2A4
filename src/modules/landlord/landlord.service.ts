import { PrismaClient } from '@prisma/client';
import { AppError } from '../../errors/AppError';

const prisma = new PrismaClient();

const createProperty = async (payload: any, landlordId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      category: true,
    }
  });

  return result;
};

const updateProperty = async (id: string, payload: any, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new AppError(404, 'Property not found');
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(403, 'You are not authorized to update this property');
  }

  const result = await prisma.property.update({
    where: { id },
    data: payload,
    include: { category: true }
  });

  return result;
};

const deleteProperty = async (id: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new AppError(404, 'Property not found');
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(403, 'You are not authorized to delete this property');
  }

  const activeRentals = await prisma.rentalRequest.count({
    where: {
      propertyId: id,
      status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
    },
  });

  if (activeRentals > 0) {
    throw new AppError(400, 'Cannot delete property with active or pending rental requests');
  }

  const result = await prisma.property.delete({
    where: { id },
  });

  return result;
};

const getLandlordProperties = async (landlordId: string) => {
  const result = await prisma.property.findMany({
    where: { landlordId },
    include: {
      category: true,
      _count: {
        select: { rentalRequests: true, reviews: true },
      },
    },
    orderBy: { createdAt: 'desc' },
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
    throw new AppError(404, 'Rental request not found');
  }

  if (request.property.landlordId !== landlordId) {
    throw new AppError(403, 'You are not authorized to update this request');
  }

  if (request.status !== 'PENDING') {
    throw new AppError(400, 'Only pending requests can be approved or rejected');
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: { status },
  });

  return result;
};

const completeRentalRequest = async (id: string, landlordId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true }
  });

  if (!request) {
    throw new AppError(404, 'Rental request not found');
  }

  if (request.property.landlordId !== landlordId) {
    throw new AppError(403, 'You are not authorized to update this request');
  }

  if (request.status !== 'ACTIVE') {
    throw new AppError(400, 'Only active rentals can be marked as completed');
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });

  await prisma.property.update({
    where: { id: request.propertyId },
    data: { status: 'AVAILABLE' },
  });

  return result;
};

export const LandlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
  getLandlordRequests,
  updateRequestStatus,
  completeRentalRequest,
};
