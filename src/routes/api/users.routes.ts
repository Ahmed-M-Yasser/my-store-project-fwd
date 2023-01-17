import { Router } from 'express';
import * as controllers from '../../controllers/users.controllers';
import { authenticationMiddleware } from '../../middleware/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .post(controllers.create)
  .get(authenticationMiddleware, controllers.getAll)
  .patch(authenticationMiddleware, controllers.updateUser);
routes
  .route('/:id')
  .get(authenticationMiddleware, controllers.getById)
  .delete(authenticationMiddleware, controllers.deleteUser);
routes.route('/authenticate').post(controllers.authenticate);

export default routes;
