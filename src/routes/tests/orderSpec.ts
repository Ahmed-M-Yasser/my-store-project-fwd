import supertest from 'supertest';
import db from '../../database';
import ProductModel from '../../models/product.model';
import UserModel from '../../models/user.model';
import PRODUCT from '../../types/product.type';
import User from '../../types/user.type';
import OrderProduct from '../../types/orderProduct.type';
import app from '../../index';

const userModel = new UserModel();
const productModel = new ProductModel();
const request = supertest(app);
let token = '';

describe('routes/orderSpec', () => {
  describe('Order API Endpoints', () => {
    const user = {
      email: 'user@mail.com',
      first_name: 'fst',
      last_name: 'lst',
      pwd: 'P@ssw0rd',
      user_role: 'Admin',
    } as User;

    const product1 = {
      product_name: 'test product 1',
      price: 10,
    } as PRODUCT;
    const product2 = {
      product_name: 'test product 2',
      price: 20,
    } as PRODUCT;

    let createdOrderId: string;

    beforeAll(async () => {
      const createdUser = await userModel.create(user);
      user.id = createdUser.id;

      const createdProduct1 = await productModel.create(product1);
      product1.id = createdProduct1.id;
      const createdProduct2 = await productModel.create(product2);
      product2.id = createdProduct2.id;

      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'user@mail.com',
          password: 'P@ssw0rd',
        });
      const { token: userToken } = res.body.data;
      token = userToken;
    });
    afterAll(async () => {
      const connection = await db.connect();
      let sql = 'DELETE FROM order_products;';
      await connection.query(sql);

      sql = 'DELETE FROM orders;';
      await connection.query(sql);

      sql = 'DELETE FROM products;';
      await connection.query(sql);

      sql = 'DELETE FROM users;';
      await connection.query(sql);

      connection.release();
    });

    describe('does order logic work', () => {
      it('create method should return a new order', async () => {
        const res = await request
          .post('/api/orders')
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token)
          .send([
            {
              product_id: product1.id,
              qty: 2,
            },
            {
              product_id: product2.id,
              qty: 1,
            },
          ] as OrderProduct[]);

        createdOrderId = res.body.data.orderMaster.id as string;

        expect(res.status).toBe(200);
        expect(parseInt(res.body.data.orderMaster.total as unknown as string)).toBe(40);
        expect(res.body.data.orderMaster.order_status).toBe('Active');
        expect(res.body.data.orderMaster.user_id).toBe(user.id as string);
        expect(res.body.data.orderDetails.length).toBe(2);
      });
      it('should return all orders (1)', async () => {
        const res = await request
          .get('/api/orders')
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
      });
      it('should return order by id', async () => {
        const res = await request
          .get('/api/orders/' + createdOrderId)
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        expect(parseInt(res.body.data.orderMaster.total as unknown as string)).toBe(40);
      });
      it('should update order status', async () => {
        const res = await request
          .patch('/api/orders/' + createdOrderId + '/' + 'Rejected')
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);

        const { id, order_status, total } = res.body.data.orderMaster;
        expect(id).toBe(createdOrderId);
        expect(order_status).toBe('Rejected');
        expect(parseInt(total as unknown as string)).toBe(40);
      });
    });
  });
});
