import { Router } from 'express';
import usersRoutes from './api/users.routes';
import ordersRoutes from './api/order.routes';
import productsRoutes from './api/products.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/products', productsRoutes);

export default routes;
