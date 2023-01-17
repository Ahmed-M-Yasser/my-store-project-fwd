"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = exports.isAdmin = exports.handleToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const handleUnauthorized = (next) => {
    const err = new Error('Unauthorized request.');
    err.status = 401;
    next(err);
};
const handleToken = (req) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const bearer = authHeader.split(' ')[0].toLowerCase();
        const token = authHeader.split(' ')[1];
        if (bearer === 'bearer' && token) {
            const decode = jsonwebtoken_1.default.verify(token, config_1.default.tokenSecret);
            if (decode)
                return decode;
        }
    }
    return '';
};
exports.handleToken = handleToken;
const isAdmin = (req) => {
    if ((0, exports.handleToken)(req)) {
        const tokenDetails = (0, exports.handleToken)(req);
        const userRole = tokenDetails.user.user_role;
        if (userRole === 'Admin')
            return true;
    }
    return false;
};
exports.isAdmin = isAdmin;
const authenticationMiddleware = (req, _res, next) => {
    try {
        if ((0, exports.handleToken)(req))
            next();
        else
            handleUnauthorized(next);
    }
    catch (error) {
        handleUnauthorized(next);
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
