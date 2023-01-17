import db from '../database';
import PRODUCT from '../types/product.type';
import { isIdValid } from '../validations/general.validations';
import { isProductValid } from '../validations/products.validations';
import { setError } from '../middleware/error.middleware';

class ProductModel {
  async getAll(): Promise<PRODUCT[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT id, product_name, price FROM products;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error('Unable to get products: ' + (error as Error).message + '.');
    }
  }
  async getById(id: string): Promise<PRODUCT> {
    const validationResult = isIdValid(id, 'product');
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const sql = 'SELECT id, product_name, price FROM products WHERE id = ($1);';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error('Unable to get product by id: ' + (error as Error).message + '.');
    }
  }
  async create(p: PRODUCT): Promise<PRODUCT> {
    const validationResult = isProductValid(p);
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const sql =
        'INSERT INTO products (product_name, price) ' +
        'VALUES ($1, $2) RETURNING id, product_name, price;';
      const result = await connection.query(sql, [p.product_name, p.price]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        'Unable to create product (' + p.product_name + '): ' + (error as Error).message + '.'
      );
    }
  }
}

export default ProductModel;
