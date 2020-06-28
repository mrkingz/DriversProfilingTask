import { Router } from 'express';

import authController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signup', authController.create);

export default authRouter;
