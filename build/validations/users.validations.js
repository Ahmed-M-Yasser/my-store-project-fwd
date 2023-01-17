"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidLogin = exports.isUserValid = void 0;
const isUserValid = (u, isUpdate = false) => {
    try {
        if (isUpdate && (u.id === undefined || u.id === ''))
            return 'Id must be provided.';
        else if (u.email === '')
            return 'E-mail must be provided.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email))
            return 'Invalid e-mail.';
        else if (u.first_name === '')
            return 'First name must be provided.';
        else if (u.last_name === '')
            return 'Last name must be provided.';
        else if (u.pwd === undefined || u.pwd === '')
            return 'password must be provided.';
        else if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(u.pwd))
            return 'Invalid password. Password must be 8 characters minimum & contains at least 1 small letter, 1 capital letter, 1 special character & a number.';
        else if (!isUpdate && (u.user_role === undefined || u.user_role === ''))
            return 'User role must be provided.';
        else if (!isUpdate && !(u.user_role === 'Admin' || u.user_role === 'Sales'))
            return "User role can only be 'Admin' or 'Sales'.";
        return 'valid';
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isUserValid = isUserValid;
const isValidLogin = (email, password) => {
    try {
        if (email === undefined || email === '')
            return 'E-mail must be provided.';
        else if (password === undefined || password === '')
            return 'Password must be provided.';
        return 'valid';
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isValidLogin = isValidLogin;
