"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setError = exports.errorMiddleware = void 0;
const errorMiddleware = (error, _req, res, _next) => {
    const status = error.status || 500;
    const message = error.message || 'Unexpected error';
    res.status(status).json({ status, message });
};
exports.errorMiddleware = errorMiddleware;
const setError = (error = 'Unexpected error', status) => {
    const err = new Error(error);
    err.status = status || 500;
    throw err;
};
exports.setError = setError;
