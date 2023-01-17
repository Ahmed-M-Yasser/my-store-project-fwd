"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const general_validations_1 = require("../validations/general.validations");
const products_validations_1 = require("../validations/products.validations");
const error_middleware_1 = require("../middleware/error.middleware");
class ProductModel {
    async getAll() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, product_name, price FROM products;';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error('Unable to get products: ' + error.message + '.');
        }
    }
    async getById(id) {
        const validationResult = (0, general_validations_1.isIdValid)(id, 'product');
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, product_name, price FROM products WHERE id = ($1);';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to get product by id: ' + error.message + '.');
        }
    }
    async create(p) {
        const validationResult = (0, products_validations_1.isProductValid)(p);
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO products (product_name, price) ' +
                'VALUES ($1, $2) RETURNING id, product_name, price;';
            const result = await connection.query(sql, [p.product_name, p.price]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to create product (' + p.product_name + '): ' + error.message + '.');
        }
    }
}
exports.default = ProductModel;
