"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./api/users.routes"));
const order_routes_1 = __importDefault(require("./api/order.routes"));
const products_routes_1 = __importDefault(require("./api/products.routes"));
const routes = (0, express_1.Router)();
routes.use('/users', users_routes_1.default);
routes.use('/orders', order_routes_1.default);
routes.use('/products', products_routes_1.default);
exports.default = routes;
