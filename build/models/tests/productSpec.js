"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const product_model_1 = __importDefault(require("../product.model"));
const productModel = new product_model_1.default();
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
        };
        beforeAll(async () => {
            const createdProduct = await productModel.create(product);
            product.id = createdProduct.id;
        });
        afterAll(async () => {
            const connection = await database_1.default.connect();
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
            expect(parseInt(createdProduct.price)).toBe(20);
        });
        it('should return all products (2)', async () => {
            const products = await productModel.getAll();
            expect(products.length).toBe(2);
        });
        it('should return product by id', async () => {
            const p = await productModel.getById(product.id);
            expect(p.id).toBe(product.id);
            expect(parseInt(p.price)).toBe(10);
        });
    });
});
