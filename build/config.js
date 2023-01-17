"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PORT, ENV, POSTGRES_DRIVER, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD, PEPPER, SALT_ROUNDS, TOKEN_SECRET, } = process.env;
exports.default = {
    port: PORT,
    env: ENV,
    host: POSTGRES_HOST,
    dbPort: POSTGRES_PORT,
    database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    pepper: PEPPER,
    saltRounds: SALT_ROUNDS,
    tokenSecret: TOKEN_SECRET,
    Postgres_Driver: POSTGRES_DRIVER,
};
