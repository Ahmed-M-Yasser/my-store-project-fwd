"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIdValid = void 0;
const isIdValid = (id, source) => {
    try {
        if (id === undefined || id === '')
            return source + ' id must be provided.';
        return 'valid';
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isIdValid = isIdValid;
