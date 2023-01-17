"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../../database"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index_1 = __importDefault(require("../../index"));
const userModel = new user_model_1.default();
const productModel = new product_model_1.default();
const request = (0, supertest_1.default)(index_1.default);
let token = '';
describe('routes/orderSpec', () => {
    describe('Order API Endpoints', () => {
        const user = {
            email: 'user@mail.com',
            first_name: 'fst',
            last_name: 'lst',
            pwd: 'P@ssw0rd',
            user_role: 'Admin',
        };
        const product1 = {
            product_name: 'test product 1',
            price: 10,
        };
        const product2 = {
            product_name: 'test product 2',
            price: 20,
        };
        let createdOrderId;
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
                ]);
                createdOrderId = res.body.data.orderMaster.id;
                expect(res.status).toBe(200);
                expect(parseInt(res.body.data.orderMaster.total)).toBe(40);
                expect(res.body.data.orderMaster.order_status).toBe('Active');
                expect(res.body.data.orderMaster.user_id).toBe(user.id);
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
                expect(parseInt(res.body.data.orderMaster.total)).toBe(40);
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
                expect(parseInt(total)).toBe(40);
            });
        });
    });
});
