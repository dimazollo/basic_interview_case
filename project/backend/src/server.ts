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
