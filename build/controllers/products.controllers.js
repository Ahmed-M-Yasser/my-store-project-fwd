"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getById = exports.getAll = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const productModel = new product_model_1.default();
const getAll = async (_req, res, next) => {
    try {
        const products = await productModel.getAll();
        res.json({
            status: 'success',
            data: products,
            message: 'Products returned successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const product = await productModel.getById(req.params.id);
        res.json({
            status: 'success',
            data: product,
            message: 'Product returned successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        if (!(0, authentication_middleware_1.isAdmin)(req)) {
            const err = new Error("You don't have permission to create new product.");
            err.status = 401;
            next(err);
            return;
        }
        const product = await productModel.create(req.body);
        res.json({
            status: 'success',
            data: product,
            message: 'Product created successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
