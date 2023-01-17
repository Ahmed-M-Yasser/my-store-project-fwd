"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_validations_1 = require("../general.validations");
describe('validations/generalSpec', () => {
    describe('isIdValid', () => {
        it('should be valid (c2299c82-e65a-478a-8fee-24fa9b49109e)', () => {
            expect((0, general_validations_1.isIdValid)('c2299c82-e65a-478a-8fee-24fa9b49109e', 'test')).toBe('valid');
        });
        it('should be invalid ()', () => {
            expect((0, general_validations_1.isIdValid)('', 'test')).not.toBe('valid');
        });
    });
});
