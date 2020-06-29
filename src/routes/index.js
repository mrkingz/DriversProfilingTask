import { Router } from 'express';
import config from 'config';

import authRouters from './auth';
import associationRoutes from './association';
import Validation from '../middlewares/validations';

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Welcome to ${config.get('name')} API`,
  });
});

mainRouter.use(Validation.validateFields);
mainRouter.use('/auth', authRouters);
mainRouter.use('/associations', associationRoutes);

export default mainRouter;
