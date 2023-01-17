"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdateOrderValid = exports.isOrderValid = void 0;
const isOrderValid = (o) => {
    let result = 'valid', parsedDec;
    try {
        o.forEach((element) => {
            if (element.product_id === '') {
                result = 'Product id must be provided.';
                return;
            }
            parsedDec = parseFloat(element.qty);
            if (!parsedDec || parsedDec <= 0) {
                result = 'Invalid quantity value.';
                return;
            }
        });
        return result;
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isOrderValid = isOrderValid;
const isUpdateOrderValid = (orderId, orderStatus) => {
    try {
        if (!orderId || orderId === '')
            return 'Order id must be provided.';
        else if (!orderStatus || orderStatus === '')
            return 'Order status must be provided.';
        else if (!(orderStatus === 'Confirmed' || orderStatus === 'Rejected'))
            return "Order status can only be 'Confirmed' or 'Rejected'.";
        return 'valid';
    }
    catch (error) {
        throw new Error('Bad request: ' + error.message + '.');
    }
};
exports.isUpdateOrderValid = isUpdateOrderValid;
