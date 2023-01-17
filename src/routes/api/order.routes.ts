import { Router } from 'express';
import * as controllers from '../../controllers/orders.controllers';
import { authenticationMiddleware } from '../../middleware/authentication.middleware';

const routes = Router();

routes.route('/').get(authenticationMiddleware, controllers.getAll).post(controllers.create);
routes.route('/:id').get(authenticationMiddleware, controllers.getById);
routes.route('/:id/:status').patch(controllers.updateStatus);

export default routes;
