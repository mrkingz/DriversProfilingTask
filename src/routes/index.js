import { Router } from 'express';
import config from 'config';

import authRouter from './auth';

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Welcome to ${config.get('name')} API`,
  });
});

mainRouter.use('/auth', authRouter);

export default mainRouter;
