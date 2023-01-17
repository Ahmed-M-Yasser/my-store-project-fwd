import supertest from 'supertest';
import db from '../../database';
import UserModel from '../../models/user.model';
import User from '../../types/user.type';
import app from '../../index';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

describe('routes/userSpec', () => {
  describe('User API Endpoints', () => {
    const user = {
      email: 'user@mail.com',
      first_name: 'fst',
      last_name: 'lst',
      pwd: 'P@ssw0rd',
      user_role: 'Admin',
    } as User;

    beforeAll(async () => {
      const createdUser = await userModel.create(user);
      user.id = createdUser.id;
    });
    afterAll(async () => {
      const connection = await db.connect();
      const sql = 'DELETE FROM users;';
      await connection.query(sql);
      connection.release();
    });

    describe('does authenticate work', () => {
      it('should authenticate & return the user', async () => {
        const res = await request
          .post('/api/users/authenticate')
          .set('Content-type', 'application/json')
          .send({
            email: 'user@mail.com',
            password: 'P@ssw0rd',
          });
        expect(res.status).toBe(200);
        const { id, token: userToken, user_role } = res.body.data;
        expect(id).toBe(user.id);
        expect(user_role).toBe('Admin');
        token = userToken;
      });
      it('should return null for wrong credentials', async () => {
        const res = await request
          .post('/api/users/authenticate')
          .set('Content-type', 'application/json')
          .send({
            email: 'user@mail.com',
            password: 'P@ssw0rdZZZ',
          });
        expect(res.status).toBe(401);
      });
    });

    describe('does user logic work', () => {
      it('create method should return a new user', async () => {
        const res = await request.post('/api/users').set('Content-type', 'application/json').send({
          email: 'user2@mail.com',
          first_name: 'fst',
          last_name: 'lst',
          pwd: 'P@ssw0rd',
          user_role: 'Sales',
        });
        expect(res.status).toBe(200);
        const { email, first_name, last_name, user_role } = res.body.data;
        expect(email).toBe('user2@mail.com');
        expect(first_name).toBe('fst');
        expect(last_name).toBe('lst');
        expect(user_role).toBe('Sales');
      });
      it('create method only accept emails in this format (text@text.text)', async () => {
        const res = await request.post('/api/users').set('Content-type', 'application/json').send({
          email: 'user2mailcom',
          first_name: 'fst',
          last_name: 'lst',
          pwd: 'P@ssw0rd',
          user_role: 'Sales',
        });
        expect(res.status).toBe(400);
      });
      it('create method only accept passwords in this format (8 characters minimum & contains at least 1 small letter, 1 capital letter, 1 special character & a number.)', async () => {
        const res = await request.post('/api/users').set('Content-type', 'application/json').send({
          email: 'user2@mail.com',
          first_name: 'fst',
          last_name: 'lst',
          pwd: 'password',
          user_role: 'Sales',
        });
        expect(res.status).toBe(400);
      });
      //it's expected to be 1 here becuse I'm returning only sales users in this API but we created 1 admin & 1 sales
      it('should return all users (1)', async () => {
        const res = await request
          .get('/api/users')
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token)
          .send({
            email: 'user2@mail.com',
            first_name: 'fst',
            last_name: 'lst',
            pwd: 'P@ssw0rd',
            user_role: 'Admin',
          });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
      });
      it('should return users by id', async () => {
        const res = await request
          .get('/api/users/' + user.id)
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token)
          .send({
            email: 'user2@mail.com',
            first_name: 'fst',
            last_name: 'lst',
            pwd: 'P@ssw0rd',
            user_role: 'Admin',
          });
        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe('user@mail.com');
      });
      it('should update user', async () => {
        const res = await request
          .patch('/api/users')
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token)
          .send({
            ...user,
            first_name: 'fst nme',
          });
        expect(res.status).toBe(200);

        const { id, email, first_name, last_name } = res.body.data;
        expect(id).toBe(user.id);
        expect(email).toBe(user.email);
        expect(first_name).toBe('fst nme');
        expect(last_name).toBe(user.last_name);
      });
      it('should delete user', async () => {
        const res = await request
          .delete('/api/users/' + user.id)
          .set('Content-type', 'application/json')
          .set('Authorization', 'bearer ' + token);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(user.id);
      });
    });
  });
});
