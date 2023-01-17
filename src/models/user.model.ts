import bcrypt from 'bcrypt';
import db from '../database';
import User from '../types/user.type';
import config from '../config';
import { isUserValid } from '../validations/users.validations';
import { isIdValid } from '../validations/general.validations';
import { setError } from '../middleware/error.middleware';

const pepper = config.pepper as string;

const hashPassword = (password: string) => {
  const salt = parseInt(config.saltRounds as string, 10);
  return bcrypt.hashSync(password + pepper, salt);
};

class UserModel {
  async create(u: User): Promise<User> {
    const validationResult = isUserValid(u);
    if (validationResult !== 'valid') setError(validationResult, 400);
    try {
      const connection = await db.connect();
      const sql =
        'INSERT INTO users (email, first_name, last_name, pwd, user_role) ' +
        'VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, user_role;';
      const result = await connection.query(sql, [
        u.email,
        u.first_name,
        u.last_name,
        hashPassword(u.pwd as string),
        u.user_role, //TODO: if empty, make it sales
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error('Unable to create user (' + u.email + '): ' + (error as Error).message + '.');
    }
  }
  //return all sales users
  async getAll(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT id, email, first_name, last_name FROM users where user_role = $1;';
      const result = await connection.query(sql, ['Sales']);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error('Unable to get users: ' + (error as Error).message + '.');
    }
  }
  //get current user details
  async getById(id: string): Promise<User> {
    const validationResult = isIdValid(id, 'user');
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const sql = 'SELECT id, email, first_name, last_name FROM users WHERE id = ($1);';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error('Unable to get user by id: ' + (error as Error).message + '.');
    }
  }
  async updateUser(u: User): Promise<User> {
    const validationResult = isUserValid(u, true);
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      const sql =
        'UPDATE users ' +
        'SET email=$1, first_name=$2, last_name=$3, pwd=$4 ' +
        'WHERE id = $5 ' +
        'RETURNING id, email, first_name, last_name;';
      const result = await connection.query(sql, [
        u.email,
        u.first_name,
        u.last_name,
        hashPassword(u.pwd as string),
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error('Unable to update user (' + u.email + '): ' + (error as Error).message + '.');
    }
  }
  async deleteUser(id: string): Promise<User> {
    const validationResult = isIdValid(id, 'user');
    if (validationResult !== 'valid') setError(validationResult, 400);

    try {
      const connection = await db.connect();
      let sql = 'select exists (select * from orders where user_id = $1);';
      let result = await connection.query(sql, [id]);
      const { exists } = result.rows[0];
      if (exists)
        setError('This user cannot be deleted because it already placed an order');

      sql = 'DELETE FROM users WHERE id = ($1) RETURNING id, email, first_name, last_name;';
      result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error('Unable to delete user: ' + (error as Error).message + '.');
    }
  }
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT pwd FROM users WHERE email = $1;';
      const result = await connection.query(sql, [email]);

      if (result.rows.length) {
        const { pwd: hashedPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(password + pepper, hashedPassword);
        if (isPasswordValid) {
          const userInfo = await connection.query(
            'SELECT id, user_role FROM users WHERE email = $1',
            [email]
          );
          return userInfo.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error('Unable to authenticate user: ' + (error as Error).message + '.');
    }
  }
}

export default UserModel;
