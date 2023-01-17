"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProductValid = void 0;
const isProductValid = (p) => {
    try {
        const parsedPrice = parseFloat(p.price);
        if (p.product_name === '')
            return 'Product name must be provided.';
        else if (!parsedPrice || parsedPrice <= 0)
            return 'Invalid price value.';
        return 'valid';
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isProductValid = isProductValid;
