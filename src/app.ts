import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import router from './routes';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import rateLimit from 'express-rate-limit';

import { PaymentController } from './modules/payment/payment.controller';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});

import cookieParser from 'cookie-parser';

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);

// Webhook must be parsed as raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);

app.use(express.json());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to RentNest API!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
