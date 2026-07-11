import Stripe from "stripe";
import { PrismaClient, PaymentProvider } from "@prisma/client";
import config from "../../config";
import { AppError } from "../../errors/AppError";

const stripe = new Stripe(config.stripe.secret_key as string, {
  apiVersion: "2026-06-24.dahlia" as any,
});

const prisma = new PrismaClient();

const createPaymentIntent = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new AppError(404, "Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to pay for this request");
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new AppError(400, "Rental request is not approved for payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalRequestId },
  });

  if (existingPayment && existingPayment.status === "COMPLETED") {
    throw new AppError(409, "Payment already completed for this request");
  }

  const amountInCents = Math.round(Number(rentalRequest.property.rent) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
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
        method: "card",
        provider: PaymentProvider.STRIPE,
        status: "PENDING",
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

const confirmPayment = async (paymentId: string, tenantId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to confirm this payment");
  }

  if (payment.status === "COMPLETED") {
    return payment;
  }
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment.transactionId,
  );

  if (paymentIntent.status === "succeeded") {
    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "COMPLETED",
          paidAt: new Date(),
        },
      }),
      prisma.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: "ACTIVE" },
      }),
      prisma.property.update({
        where: { id: payment.rentalRequest.propertyId },
        data: { status: "RENTED" },
      }),
    ]);

    return updatedPayment;
  } else {
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: paymentIntent.status === "canceled" ? "FAILED" : "PENDING",
      },
    });

    return updatedPayment;
  }
};

const simulatePayment = async (paymentId: string, tenantId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to simulate this payment");
  }

  if (payment.status === "COMPLETED") {
    return payment;
  }

  try {
    await stripe.paymentIntents.confirm(payment.transactionId, {
      payment_method: "pm_card_visa",
      return_url: "https://example.com", // Required for some payment methods
    });
  } catch (err: any) {
    // If it's already confirmed or fails, we log it and proceed to check the status anyway
    console.error("Stripe simulation error:", err.message);
  }

  // Now that it is confirmed on Stripe, call the confirm function to update the database
  return await confirmPayment(paymentId, tenantId);
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhook_secret as string,
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentIntent.id },
    });

    if (payment) {
      const rentalRequest = await prisma.rentalRequest.findUnique({
        where: { id: payment.rentalRequestId },
      });

      if (rentalRequest) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { transactionId: paymentIntent.id },
            data: {
              status: "COMPLETED",
              paidAt: new Date(),
            },
          }),
          prisma.rentalRequest.update({
            where: { id: payment.rentalRequestId },
            data: { status: "ACTIVE" },
          }),
          prisma.property.update({
            where: { id: rentalRequest.propertyId },
            data: { status: "RENTED" },
          }),
        ]);
      }
    }
  }

  return { received: true };
};

const getPaymentHistory = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: { tenantId },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getPaymentById = async (id: string, tenantId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.tenantId !== tenantId) {
    throw new AppError(403, "You are not authorized to view this payment");
  }

  return payment;
};

export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
  simulatePayment,
  handleWebhook,
  getPaymentHistory,
  getPaymentById,
};
