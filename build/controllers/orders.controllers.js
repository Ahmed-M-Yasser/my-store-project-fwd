"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getById = exports.getAll = exports.create = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const orderModel = new order_model_1.default();
const create = async (req, res, next) => {
    try {
        const tokenDetails = (0, authentication_middleware_1.handleToken)(req);
        const userId = tokenDetails.user.id;
        const order = await orderModel.create(req.body, userId);
        res.json({
            status: 'success',
            data: { ...order },
            message: 'Order created successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const tokenDetails = (0, authentication_middleware_1.handleToken)(req);
        const userId = tokenDetails.user.id;
        const orders = await orderModel.getAll(userId);
        res.json({
            status: 'success',
            data: orders,
            message: 'Orders returned successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const tokenDetails = (0, authentication_middleware_1.handleToken)(req);
        const userId = tokenDetails.user.id;
        const order = await orderModel.getById(userId, req.params.id);
        res.json({
            status: 'success',
            data: order,
            message: 'Order returned successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const updateStatus = async (req, res, next) => {
    if (!(0, authentication_middleware_1.isAdmin)(req)) {
        const err = new Error("You don't have permission to update this order.");
        err.status = 401;
        next(err);
        return;
    }
    try {
        const order = await orderModel.updateStatus(req.params.id, req.params.status);
        res.json({
            status: 'success',
            data: { ...order },
            message: 'Order updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
