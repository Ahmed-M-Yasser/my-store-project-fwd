"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config"));
const pool = new pg_1.Pool({
    host: config_1.default.host,
    database: config_1.default.database,
    user: config_1.default.user,
    password: config_1.default.password,
    port: config_1.default.dbPort,
});
pool.on('error', (error) => {
    console.error(error.message);
});
exports.default = pool;
