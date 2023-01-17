"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_validations_1 = require("../orders.validations");
describe('validations/orderSpec', () => {
    describe('isOrderValid', () => {
        it('should be valid (product_id & qty are provided)', () => {
            expect((0, orders_validations_1.isOrderValid)([
                {
                    product_id: 'c2299c82-e65a-478a-8fee-24fa9b49109e',
                    qty: 2,
                },
                {
                    product_id: 'c2299c82-e65a-478a-8fee-24fa9b49109f',
                    qty: 5,
                },
            ])).toBe('valid');
        });
        it('should be invalid (negative qty)', () => {
            expect((0, orders_validations_1.isOrderValid)([
                {
                    product_id: 'c2299c82-e65a-478a-8fee-24fa9b49109e',
                    qty: -2,
                },
            ])).not.toBe('valid');
        });
    });
    describe('isUpdateOrderValid', () => {
        it('should be valid (both orderId & orderStatus are valid)', () => {
            expect((0, orders_validations_1.isUpdateOrderValid)('c2299c82-e65a-478a-8fee-24fa9b49109e', 'Confirmed')).toBe('valid');
        });
        it('should be invalid (missing orderId)', () => {
            expect((0, orders_validations_1.isUpdateOrderValid)(undefined, 'Confirmed')).not.toBe('valid');
        });
        it('should be invalid (allowed order status are either Confirmed or Rejected)', () => {
            expect((0, orders_validations_1.isUpdateOrderValid)('c2299c82-e65a-478a-8fee-24fa9b49109e', 'Confrmed')).not.toBe('valid');
        });
    });
});
