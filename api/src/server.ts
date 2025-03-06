import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { handler } from './middleware/error';
import MainRouter from './startup/initRouter';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'https://otp-code-henna.vercel.app',
    methods: 'GET,POST,PUT,DELETE'
  })
);
app.use(helmet());

MainRouter(app);

app.use('*', (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: req.originalUrl + ' not found' });
});

app.use(handler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
