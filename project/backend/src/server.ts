import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import authRouter from './AuthFeature/controller';
import userRouter from './UserFeature/controller';
import ticketRouter from './TicketFeature/controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Load OpenAPI specification
const openapiDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Support Ticket API Documentation',
}));

// Delay middleware for /api routes (3 seconds)
app.use('/api', (req: Request, res: Response, next) => {
  setTimeout(() => {
    next();
  }, 3000);
});

// Error simulation middleware - returns 500 on every 5th request
let requestCounter = 0;
app.use('/api', (req: Request, res: Response, next) => {
  requestCounter++;
  if (requestCounter % 5 === 0) {
    res.status(500).json({ error: 'Planned server error' });
    return;
  }
  next();
});

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
