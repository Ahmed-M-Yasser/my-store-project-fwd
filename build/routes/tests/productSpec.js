"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../../database"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index_1 = __importDefault(require("../../index"));
const userModel = new user_model_1.default();
const request = (0, supertest_1.default)(index_1.default);
let token = '', salesToken = '';
const createUser = async (u) => {
    const createdUser = await userModel.create(u);
    u.id = createdUser.id;
    const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
        email: u.email,
        password: u.pwd,
    });
    const { token: userToken } = res.body.data;
    return userToken;
};
describe('routes/productSpec', () => {
    describe('Product API Endpoints', () => {
        const user = {
            email: 'user@mail.com',
            first_name: 'fst',
            last_name: 'lst',
            pwd: 'P@ssw0rd',
            user_role: 'Admin',
        };
        const salesUser = {
            email: 'user2@mail.com',
            first_name: 'fst',
            last_name: 'lst',
            pwd: 'P@ssw0rd',
            user_role: 'Sales',
        };
        beforeAll(async () => {
            token = await createUser(user);
            salesToken = await createUser(salesUser);
        });
        afterAll(async () => {
            const connection = await database_1.default.connect();
            let sql = 'DELETE FROM users;';
            await connection.query(sql);
            sql = 'DELETE FROM products;';
            await connection.query(sql);
            connection.release();
        });
        describe('does product logic work', () => {
            let createdProductId;
            it('create method should return a new product', async () => {
                const res = await request
                    .post('/api/products')
                    .set('Content-type', 'application/json')
                    .set('Authorization', 'bearer ' + token)
                    .send({
                    product_name: 'test product 1',
                    price: 10,
                });
                createdProductId = res.body.data.id;
                expect(res.status).toBe(200);
                expect(res.body.data.product_name).toBe('test product 1');
                expect(parseInt(res.body.data.price)).toBe(10);
            });
            it('create method should return unauthorized response for Sales users', async () => {
                const res = await request
                    .post('/api/products')
                    .set('Content-type', 'application/json')
                    .set('Authorization', 'bearer ' + salesToken)
                    .send({
                    product_name: 'test product 2',
                    price: 10,
                });
                expect(res.status).toBe(401);
            });
            it('should return all products (1)', async () => {
                const res = await request
                    .get('/api/products')
                    .set('Content-type', 'application/json')
                    .set('Authorization', 'bearer ' + token);
                expect(res.status).toBe(200);
                expect(res.body.data.length).toBe(1);
            });
            it('should return product by id', async () => {
                const res = await request
                    .get('/api/products/' + createdProductId)
                    .set('Content-type', 'application/json')
                    .set('Authorization', 'bearer ' + token);
                expect(res.status).toBe(200);
                expect(parseInt(res.body.data.price)).toBe(10);
            });
        });
    });
});
