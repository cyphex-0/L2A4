import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import router from './routes';
import globalErrorHandler from './middleware/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to RentNest API!');
});

app.use(globalErrorHandler);

export default app;
