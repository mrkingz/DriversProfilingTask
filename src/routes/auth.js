import { Router } from 'express';

import authController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signup', authController.checkEmail, authController.create);
authRouter.post('/signin', authController.signin);

export default authRouter;
