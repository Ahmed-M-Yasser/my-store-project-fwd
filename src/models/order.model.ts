import db from '../database';
import { ORDER, OrderVM } from '../types/order.type';
import OrderProduct from '../types/orderProduct.type';
import PRODUCT from '../types/product.type';
import Error from '../interfaces/error.interface';
import { isOrderValid, isUpdateOrderValid } from '../validations/orders.validations';
import { isIdValid } from '../validations/general.validations';
import { setError } from '../middleware/error.middleware';

const getPriceById = (productDetails: PRODUCT[], x: OrderProduct): number => {
  return productDetails.find((e) => e.id === x.product_id)?.price as number;
};

class OrderModel {
  async create(o: OrderProduct[], userId: string): Promise<OrderVM> {
    const validationResult = isOrderValid(o);
    if (validationResult !== 'valid') setError(validationResult, 400);
    try {
      const connection = await db.connect();
      const productResult = await connection.query(
        'SELECT id, price FROM products WHERE id = ANY ($1)',
        [o.map((x) => x.product_id)]
      );
      const productDetails: PRODUCT[] = productResult.rows;
      if (!productDetails.length) setError('Incorrect product id(s)', 400);

      let total = 0;
      o.forEach((element) => {
        if (productDetails.some((x) => x.id === element.product_id))
          total += element.qty * getPriceById(productDetails, element);
      });
      let sql =
        'INSERT INTO orders (total, user_id, order_status) ' +
        'VALUES ($1, $2, $3) RETURNING id, total, order_date, user_id, order_status;';
      const result = await connection.query(sql, [total, userId, 'Active']);
      const orderMaster: ORDER = result.rows[0];
      sql = '';
      o.forEach((element) => {
        sql +=
          "INSERT INTO order_products (order_id, product_id, qty, price) VALUES ('" +
          orderMaster.id +
          "', '" +
          element.product_id +
          "', " +
          element.qty +
          ', ' +
          getPriceById(productDetails, element) +
          ');';
      });
      await connection.query(sql);
      const orderDetails = await this.getById(userId, orderMaster.id);
      connection.release();
      return orderDetails;
    } catch (error) {
      throw new Error('Unable to create order: ' + (error as Error).message + '.');
    }
  }
  async getAll(userId: string): Promise<OrderVM[]> {
    try {
      const connection = await db.connect();
      const orderMasterResult = await connection.query(
        'SELECT id, total, order_date, user_id, order_status FROM orders WHERE user_id = ($1)',
        [userId]
      );
      const orderDetailsResult = await connection.query(
        'SELECT id, order_id, product_id, qty, price FROM order_products'
      );
      const result: OrderVM[] = [];
      (orderMasterResult.rows as ORDER[]).forEach((om) => {
        result.push({
          orderMaster: om,
          orderDetails: (orderDetailsResult.rows as OrderProduct[]).filter(
            (x) => x.order_id === om.id
          ),
        });
      });
      connection.release();
      return result;
    } catch (error) {
      throw new Error('Unable to get orders: ' + (error as Error).message + '.');
    }
  }
  async getById(userId: string, id?: string): Promise<OrderVM> {
    const validationResult = isIdValid(id, 'order');
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const orderMasterResult = await connection.query(
        'SELECT id, total, order_date, user_id, order_status FROM orders WHERE id = ($1) and user_id = ($2);',
        [id, userId]
      );
      const orderDetailsResult = await connection.query(
        'SELECT id, order_id, product_id, qty, price FROM order_products WHERE order_id = ($1);',
        [id]
      );

      if (!orderMasterResult.rows[0]) {
        const err: Error = new Error("You don't have permission to view this order");
        err.status = 401;
        throw err;
      }

      const result: OrderVM = {
        orderMaster: orderMasterResult.rows[0],
        orderDetails: orderMasterResult.rows[0] ? orderDetailsResult.rows : [],
      };
      connection.release();
      return result;
    } catch (error) {
      throw new Error('Unable to get order by id (' + id + '): ' + (error as Error).message + '.');
    }
  }
  async updateStatus(id?: string, status?: string): Promise<OrderVM> {
    const validationResult = isUpdateOrderValid(id, status);
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const sql =
        'UPDATE orders ' +
        'SET order_status=$1 ' +
        'WHERE id = $2 ' +
        'RETURNING id, total, order_date, user_id, order_status;';
      const result = await connection.query(sql, [
        status,
        id, //TODO: validate status to be confirmed/rejected
      ]);
      const orderDetails = await this.getById(result.rows[0].user_id, result.rows[0].id);
      connection.release();
      return orderDetails;
    } catch (error) {
      throw new Error(
        'Unable to update order status (' + id + '): ' + (error as Error).message + '.'
      );
    }
  }
}

export default OrderModel;
