import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import express from 'express';
import config from 'config';
import mainRouter from '../routes';

const appInit = async (app) => {
  app.disable('x-powered-by');

  // Always ensure sentry is setup before any other
  Sentry.init({ dsn: config.get('sentryDNS') });
  app.use(Sentry.Handlers.requestHandler());

  // Register all middlewares
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: false }));

  // Register all routes/endpoints
  app.use(config.get('api.prefix'), mainRouter);

  // The error handler must be before any other error middleware and after all registrations
  app.use(Sentry.Handlers.errorHandler());

  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });
};

export default appInit;
