import { Router } from 'express';

import authController from '../controllers/auth';
import associationContr from '../controllers/association';

const associationRouter = Router();

associationRouter.get('/', authController.checkAuth, associationContr.findAll());

export default associationRouter;
