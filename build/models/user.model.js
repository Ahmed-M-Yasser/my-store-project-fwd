"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const config_1 = __importDefault(require("../config"));
const users_validations_1 = require("../validations/users.validations");
const general_validations_1 = require("../validations/general.validations");
const error_middleware_1 = require("../middleware/error.middleware");
const pepper = config_1.default.pepper;
const hashPassword = (password) => {
    const salt = parseInt(config_1.default.saltRounds, 10);
    return bcrypt_1.default.hashSync(password + pepper, salt);
};
class UserModel {
    async create(u) {
        const validationResult = (0, users_validations_1.isUserValid)(u);
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO users (email, first_name, last_name, pwd, user_role) ' +
                'VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, user_role;';
            const result = await connection.query(sql, [
                u.email,
                u.first_name,
                u.last_name,
                hashPassword(u.pwd),
                u.user_role, //TODO: if empty, make it sales
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to create user (' + u.email + '): ' + error.message + '.');
        }
    }
    //return all sales users
    async getAll() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, email, first_name, last_name FROM users where user_role = $1;';
            const result = await connection.query(sql, ['Sales']);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error('Unable to get users: ' + error.message + '.');
        }
    }
    //get current user details
    async getById(id) {
        const validationResult = (0, general_validations_1.isIdValid)(id, 'user');
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, email, first_name, last_name FROM users WHERE id = ($1);';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to get user by id: ' + error.message + '.');
        }
    }
    async updateUser(u) {
        const validationResult = (0, users_validations_1.isUserValid)(u, true);
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            const sql = 'UPDATE users ' +
                'SET email=$1, first_name=$2, last_name=$3, pwd=$4 ' +
                'WHERE id = $5 ' +
                'RETURNING id, email, first_name, last_name;';
            const result = await connection.query(sql, [
                u.email,
                u.first_name,
                u.last_name,
                hashPassword(u.pwd),
                u.id,
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to update user (' + u.email + '): ' + error.message + '.');
        }
    }
    async deleteUser(id) {
        const validationResult = (0, general_validations_1.isIdValid)(id, 'user');
        if (validationResult !== 'valid')
            (0, error_middleware_1.setError)(validationResult, 400);
        try {
            const connection = await database_1.default.connect();
            let sql = 'select exists (select * from orders where user_id = $1);';
            let result = await connection.query(sql, [id]);
            const { exists } = result.rows[0];
            if (exists)
                (0, error_middleware_1.setError)('This user cannot be deleted because it already placed an order');
            sql = 'DELETE FROM users WHERE id = ($1) RETURNING id, email, first_name, last_name;';
            result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Unable to delete user: ' + error.message + '.');
        }
    }
    async authenticateUser(email, password) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT pwd FROM users WHERE email = $1;';
            const result = await connection.query(sql, [email]);
            if (result.rows.length) {
                const { pwd: hashedPassword } = result.rows[0];
                const isPasswordValid = bcrypt_1.default.compareSync(password + pepper, hashedPassword);
                if (isPasswordValid) {
                    const userInfo = await connection.query('SELECT id, user_role FROM users WHERE email = $1', [email]);
                    return userInfo.rows[0];
                }
            }
            connection.release();
            return null;
        }
        catch (error) {
            throw new Error('Unable to authenticate user: ' + error.message + '.');
        }
    }
}
exports.default = UserModel;
