import db from '../../database';
import OrderModel from '../order.model';
import ProductModel from '../product.model';
import UserModel from '../user.model';
import PRODUCT from '../../types/product.type';
import User from '../../types/user.type';

const productModel = new ProductModel();
const orderModel = new OrderModel();
const userModel = new UserModel();

describe('models/orderSpec order.model', () => {
  describe('do methods exists', () => {
    it('has get all orders method', async () => {
      expect(orderModel.getAll).toBeDefined();
    });
    it('has get by id method', async () => {
      expect(orderModel.getById).toBeDefined();
    });
    it('has create order method', async () => {
      expect(orderModel.create).toBeDefined();
    });
    it('has updateStatus method', async () => {
      expect(orderModel.updateStatus).toBeDefined();
    });
  });
  describe('does order logic work', () => {
    const user = {
      email: 'user@mail.com',
      first_name: 'fst',
      last_name: 'lst',
      pwd: 'P@ssw0rd',
      user_role: 'Sales',
    } as User;

    const product = {
      product_name: 'test product 1',
      price: 10,
    } as PRODUCT;

    let createdOrderId: string;

    beforeAll(async () => {
      const createdProduct = await productModel.create(product);
      product.id = createdProduct.id;

      const createdUser = await userModel.create(user);
      user.id = createdUser.id;
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

    it('create method should return a new order', async () => {
      const createdOrder = await orderModel.create(
        [
          {
            product_id: product.id as string,
            qty: 2,
            price: product.price as number,
          },
        ],
        user.id as string
      );

      createdOrderId = createdOrder.orderMaster.id as string;

      expect(parseInt(createdOrder.orderMaster.total as unknown as string)).toBe(20);
      expect(createdOrder.orderMaster.order_status).toBe('Active');
      expect(createdOrder.orderMaster.user_id).toBe(user.id as string);
      expect(createdOrder.orderDetails.length).toBe(1);
      expect(parseInt(createdOrder.orderDetails[0].price as unknown as string)).toBe(
        product.price as number
      );
    });
    it('should return all orders (1)', async () => {
      const orders = await orderModel.getAll(user.id as string);
      expect(orders.length).toBe(1);
    });
    it('should return order by id', async () => {
      const order = await orderModel.getById(user.id as string, createdOrderId);
      expect(order.orderMaster.id).toBe(createdOrderId);
      expect(parseInt(order.orderMaster.total as unknown as string)).toBe(20);
    });
    it('should update order status', async () => {
      const updatedOrder = await orderModel.updateStatus(createdOrderId, 'Confirmed');
      expect(updatedOrder.orderMaster.id).toBe(createdOrderId);
      expect(updatedOrder.orderMaster.order_status).toBe('Confirmed');
    });
  });
});
