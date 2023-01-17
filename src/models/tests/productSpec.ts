import db from '../../database';
import ProductModel from '../product.model';
import PRODUCT from '../../types/product.type';

const productModel = new ProductModel();

describe('models/productSpec product.model', () => {
  describe('do methods exists', () => {
    it('has get all products method', async () => {
      expect(productModel.getAll).toBeDefined();
    });
    it('has get by id method', async () => {
      expect(productModel.getById).toBeDefined();
    });
    it('has create product method', async () => {
      expect(productModel.create).toBeDefined();
    });
  });
  describe('does product logic work', () => {
    const product = {
      product_name: 'test product 1',
      price: 10,
    } as PRODUCT;

    beforeAll(async () => {
      const createdProduct = await productModel.create(product);
      product.id = createdProduct.id;
    });
    afterAll(async () => {
      const connection = await db.connect();
      const sql = 'DELETE FROM products;';
      await connection.query(sql);
      connection.release();
    });

    it('create method should return a new product', async () => {
      const createdProduct = await productModel.create({
        product_name: 'test product 2',
        price: 20,
      });
      expect(createdProduct.product_name).toBe('test product 2');
      expect(parseInt(createdProduct.price as unknown as string)).toBe(20);
    });
    it('should return all products (2)', async () => {
      const products = await productModel.getAll();
      expect(products.length).toBe(2);
    });
    it('should return product by id', async () => {
      const p = await productModel.getById(product.id as string);
      expect(p.id).toBe(product.id);
      expect(parseInt(p.price as unknown as string)).toBe(10);
    });
  });
});
