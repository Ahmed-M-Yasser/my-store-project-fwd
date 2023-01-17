"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.deleteUser = exports.updateUser = exports.getById = exports.getAll = exports.create = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = __importDefault(require("../config"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const users_validations_1 = require("../validations/users.validations");
const userModel = new user_model_1.default();
const isCurrentUser = (req) => {
    let id = req.params.id;
    if (!id)
        id = req.body.id;
    const tokenDetails = (0, authentication_middleware_1.handleToken)(req);
    const loggedId = tokenDetails.user.id;
    if (id !== loggedId)
        return false;
    return true;
};
const create = async (req, res, next) => {
    try {
        const user = await userModel.create(req.body);
        res.json({
            status: 'success',
            data: { ...user },
            message: 'User created successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    if (!(0, authentication_middleware_1.isAdmin)(req)) {
        const err = new Error("You don't have permission to get all users.");
        err.status = 401;
        next(err);
        return;
    }
    try {
        const user = await userModel.getAll();
        res.json({
            status: 'success',
            data: user,
            message: 'Users returned successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    if (!isCurrentUser(req)) {
        const err = new Error("You don't have permission to view this user.");
        err.status = 401;
        next(err);
        return;
    }
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        res.json({
            status: 'success',
            data: user,
            message: 'User returned successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const updateUser = async (req, res, next) => {
    if (!isCurrentUser(req)) {
        const err = new Error("You don't have permission to update this user.");
        err.status = 401;
        next(err);
        return;
    }
    try {
        const user = await userModel.updateUser(req.body);
        res.json({
            status: 'success',
            data: user,
            message: 'User updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    if (!isCurrentUser(req)) {
        const err = new Error("You don't have permission to delete this user.");
        err.status = 401;
        next(err);
        return;
    }
    try {
        const user = await userModel.deleteUser(req.params.id);
        res.json({
            status: 'success',
            data: user,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const authenticate = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validationResult = (0, users_validations_1.isValidLogin)(email, password);
        if (validationResult !== 'valid') {
            const err = new Error(validationResult);
            err.status = 400;
            next(err);
            return;
        }
        const user = await userModel.authenticateUser(email, password);
        const token = jsonwebtoken_1.default.sign({ user }, config_1.default.tokenSecret);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect credetials, please try again.',
            });
        }
        return res.json({
            status: 'success',
            data: { ...user, token },
            message: 'Successful Login',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
