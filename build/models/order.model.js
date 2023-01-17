"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const orders_validations_1 = require("../validations/orders.validations");
const general_validations_1 = require("../validations/general.validations");
const error_middleware_1 = require("../middleware/error.middleware");
const getPriceById = (productDetails, x) => {
    return productDetails.find((e) => e.id === x.product_id)?.price;
};
class OrderModel {
    async create(o, userId) {
        const validationResult = (0, orders_validations_1.isOrderValid)(o);
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const productResult = await connection.query('SELECT id, price FROM products WHERE id = ANY ($1)', [o.map((x) => x.product_id)]);
            const productDetails = productResult.rows;
            if (!productDetails.length)
                (0, error_middleware_1.setError)('Incorrect product id(s)', 400);
            let total = 0;
            o.forEach((element) => {
                if (productDetails.some((x) => x.id === element.product_id))
                    total += element.qty * getPriceById(productDetails, element);
            });
            const sql = 'INSERT INTO orders (total, user_id, order_status) ' +
                'VALUES ($1, $2, $3) RETURNING id, total, order_date, user_id, order_status;';
            const result = await connection.query(sql, [total, userId, 'Active']);
            const orderMaster = result.rows[0];
            let multipleSql = '';
            o.forEach((element) => {
                multipleSql +=
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
            await connection.query(multipleSql);
            const orderDetails = await this.getById(userId, orderMaster.id);
            connection.release();
            return orderDetails;
        }
        catch (error) {
            throw new Error('Unable to create order: ' + error.message + '.');
        }
    }
    async getAll(userId) {
        try {
            const connection = await database_1.default.connect();
            const orderMasterResult = await connection.query('SELECT id, total, order_date, user_id, order_status FROM orders WHERE user_id = ($1)', [userId]);
            const orderDetailsResult = await connection.query('SELECT id, order_id, product_id, qty, price FROM order_products');
            const result = [];
            orderMasterResult.rows.forEach((om) => {
                result.push({
                    orderMaster: om,
                    orderDetails: orderDetailsResult.rows.filter((x) => x.order_id === om.id),
                });
            });
            connection.release();
            return result;
        }
        catch (error) {
            throw new Error('Unable to get orders: ' + error.message + '.');
        }
    }
    async getById(userId, id) {
        const validationResult = (0, general_validations_1.isIdValid)(id, 'order');
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const orderMasterResult = await connection.query('SELECT id, total, order_date, user_id, order_status FROM orders WHERE id = ($1) and user_id = ($2);', [id, userId]);
            const orderDetailsResult = await connection.query('SELECT id, order_id, product_id, qty, price FROM order_products WHERE order_id = ($1);', [id]);
            if (!orderMasterResult.rows[0]) {
                const err = new Error("You don't have permission to view this order");
                err.status = 401;
                throw err;
            }
            const result = {
                orderMaster: orderMasterResult.rows[0],
                orderDetails: orderMasterResult.rows[0] ? orderDetailsResult.rows : [],
            };
            connection.release();
            return result;
        }
        catch (error) {
            throw new Error('Unable to get order by id (' + id + '): ' + error.message + '.');
        }
    }
    async updateStatus(id, status) {
        const validationResult = (0, orders_validations_1.isUpdateOrderValid)(id, status);
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'UPDATE orders ' +
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
        }
        catch (error) {
            throw new Error('Unable to update order status (' + id + '): ' + error.message + '.');
        }
    }
}
exports.default = OrderModel;
