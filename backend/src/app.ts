import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';
import routes from './routes/index.js';
import swaggerSpec from './config/swagger.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Review Moderation API Docs',
}));

app.use((_req, _res, next) => {
  next(new ApiError(404, `Route not found`));
});

app.use(errorHandler);

export { app };
