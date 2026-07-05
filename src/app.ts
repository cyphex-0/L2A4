import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
// express.json is not called here yet because of webhook requirement. It will be added later.

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to RentNest API!');
});

export default app;
