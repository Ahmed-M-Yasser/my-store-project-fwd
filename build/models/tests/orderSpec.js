"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const order_model_1 = __importDefault(require("../order.model"));
const product_model_1 = __importDefault(require("../product.model"));
const user_model_1 = __importDefault(require("../user.model"));
const productModel = new product_model_1.default();
const orderModel = new order_model_1.default();
const userModel = new user_model_1.default();
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
        };
        const product = {
            product_name: 'test product 1',
            price: 10,
        };
        let createdOrderId;
        beforeAll(async () => {
            const createdProduct = await productModel.create(product);
            product.id = createdProduct.id;
            const createdUser = await userModel.create(user);
            user.id = createdUser.id;
        });
        afterAll(async () => {
            const connection = await database_1.default.connect();
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
            const createdOrder = await orderModel.create([
                {
                    product_id: product.id,
                    qty: 2,
                    price: product.price,
                },
            ], user.id);
            createdOrderId = createdOrder.orderMaster.id;
            expect(parseInt(createdOrder.orderMaster.total)).toBe(20);
            expect(createdOrder.orderMaster.order_status).toBe('Active');
            expect(createdOrder.orderMaster.user_id).toBe(user.id);
            expect(createdOrder.orderDetails.length).toBe(1);
            expect(parseInt(createdOrder.orderDetails[0].price)).toBe(product.price);
        });
        it('should return all orders (1)', async () => {
            const orders = await orderModel.getAll(user.id);
            expect(orders.length).toBe(1);
        });
        it('should return order by id', async () => {
            const order = await orderModel.getById(user.id, createdOrderId);
            expect(order.orderMaster.id).toBe(createdOrderId);
            expect(parseInt(order.orderMaster.total)).toBe(20);
        });
        it('should update order status', async () => {
            const updatedOrder = await orderModel.updateStatus(createdOrderId, 'Confirmed');
            expect(updatedOrder.orderMaster.id).toBe(createdOrderId);
            expect(updatedOrder.orderMaster.order_status).toBe('Confirmed');
        });
    });
});
