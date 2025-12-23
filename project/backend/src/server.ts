import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './AuthFeature/controller';
import userRouter from './UserFeature/controller';
import ticketRouter from './TicketFeature/controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', ticketRouter);

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
