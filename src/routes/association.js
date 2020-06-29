import { Router } from 'express';

import authController from '../controllers/auth';
import associationContr from '../controllers/association';
import validation from '../middlewares/validations';
import userController from '../controllers/user';

const associationRouter = Router();

associationRouter.use(authController.checkAuth);

associationRouter.get('/', associationContr.findAll());
associationRouter.param('id', validation.validateParam)
  .route('/:id')
  .get(associationContr.findOne)
  .post(userController.joinAssociation);

export default associationRouter;
