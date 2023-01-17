"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_validations_1 = require("../products.validations");
describe('validations/productSpec', () => {
    describe('isProductValid', () => {
        it('should be valid (product_name & price are provided)', () => {
            expect((0, products_validations_1.isProductValid)({
                product_name: 'valid product 1',
                price: 2,
            })).toBe('valid');
        });
        it('should be invalid (missing product_name)', () => {
            expect((0, products_validations_1.isProductValid)({
                product_name: '',
                price: 2,
            })).not.toBe('valid');
        });
    });
});
