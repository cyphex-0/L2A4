import Stripe from 'stripe';
import { PrismaClient, PaymentProvider } from '@prisma/client';
import config from '../../config';

const stripe = new Stripe(config.stripe.secret_key as string, {
  apiVersion: '2025-02-24.acacia',
});

const prisma = new PrismaClient();

const createPaymentIntent = async (rentalRequestId: string, tenantId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new Error('Rental request not found');
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error('You are not authorized to pay for this request');
  }

  if (rentalRequest.status !== 'APPROVED') {
    throw new Error('Rental request is not approved for payment');
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalRequestId },
  });

  if (existingPayment && existingPayment.status === 'COMPLETED') {
    throw new Error('Payment already completed for this request');
  }

  const amountInCents = Math.round(Number(rentalRequest.property.rent) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      rentalRequestId,
      tenantId,
    },
  });

  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        transactionId: paymentIntent.id,
        rentalRequestId,
        tenantId,
        amount: Number(rentalRequest.property.rent),
        method: 'card',
        provider: PaymentProvider.STRIPE,
        status: 'PENDING',
      },
    });
  } else {
    await prisma.payment.update({
      where: { rentalRequestId },
      data: {
        transactionId: paymentIntent.id,
        amount: Number(rentalRequest.property.rent),
      },
    });
  }

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

export const PaymentService = {
  createPaymentIntent,
};
