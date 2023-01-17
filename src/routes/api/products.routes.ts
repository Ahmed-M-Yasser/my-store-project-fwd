import { Router } from 'express';
import * as controllers from '../../controllers/products.controllers';
import { authenticationMiddleware } from '../../middleware/authentication.middleware';

const routes = Router();

routes.route('/').get(controllers.getAll).post(authenticationMiddleware, controllers.create);
routes.route('/:id').get(controllers.getById);

export default routes;
