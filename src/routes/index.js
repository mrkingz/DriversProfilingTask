import { Router } from 'express';
import config from 'config';

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Welcome to ${config.get('name')} API`,
  });
});

export default mainRouter;
