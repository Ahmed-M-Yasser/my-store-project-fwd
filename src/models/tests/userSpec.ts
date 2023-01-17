import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('models/userSpec user.model', () => {
  describe('do methods exists', () => {
    it('has get all users method', async () => {
      expect(userModel.getAll).toBeDefined();
    });
    it('has authenticate method', async () => {
      expect(userModel.authenticateUser).toBeDefined();
    });
    it('has get by id method', async () => {
      expect(userModel.getById).toBeDefined();
    });
    it('has create user method', async () => {
      expect(userModel.create).toBeDefined();
    });
    it('has update user method', async () => {
      expect(userModel.updateUser).toBeDefined();
    });
    it('has delete user method', async () => {
      expect(userModel.deleteUser).toBeDefined();
    });
  });
  describe('does authenticate work', () => {
    const user = {
      email: 'user@mail.com',
      first_name: 'fst',
      last_name: 'lst',
      pwd: 'P@ssw0rd',
      user_role: 'Sales',
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

    it('should authenticate & return the user', async () => {
      const authenticatedUser = await userModel.authenticateUser(user.email, user.pwd as string);
      expect(authenticatedUser?.id).toBe(user.id);
      expect(authenticatedUser?.user_role).toBe(user.user_role);
    });
    it('should return null for wrong credentials', async () => {
      const authenticatedUser = await userModel.authenticateUser(user.email, 'blabla');
      expect(authenticatedUser).toBe(null);
    });
  });
  describe('does user logic work', () => {
    const user = {
      email: 'user@mail.com',
      first_name: 'fst',
      last_name: 'lst',
      pwd: 'P@ssw0rd',
      user_role: 'Sales',
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

    it('create method should return a new user', async () => {
      const createdUser = await userModel.create({
        email: 'user2@mail.com',
        first_name: 'fst',
        last_name: 'lst',
        pwd: 'P@ssw0rd',
        user_role: 'Sales',
      } as User);
      expect(createdUser).toEqual({
        id: createdUser.id,
        email: 'user2@mail.com',
        first_name: 'fst',
        last_name: 'lst',
        user_role: 'Sales',
      } as User);
    });
    it('should return all users (2)', async () => {
      const users = await userModel.getAll();
      expect(users.length).toBe(2);
    });
    it('should return users by id', async () => {
      const currentUser = await userModel.getById(user.id as string);
      expect(currentUser.id).toBe(user.id);
      expect(currentUser.email).toBe(user.email);
      expect(currentUser.first_name).toBe(user.first_name);
      expect(currentUser.last_name).toBe(user.last_name);
    });
    it('should update user', async () => {
      const updatedUser = await userModel.updateUser({ ...user, first_name: 'fst nme' });
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.first_name).toBe('fst nme');
      expect(updatedUser.last_name).toBe(user.last_name);
    });
    it('should delete user', async () => {
      const deletededUser = await userModel.deleteUser(user.id as string);
      expect(deletededUser.id).toBe(user.id);
    });
  });
});
