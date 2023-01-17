"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_validations_1 = require("../users.validations");
describe('validations/userSpec', () => {
    describe('isUserValid', () => {
        it('should be valid (product_name & price are provided)', () => {
            expect((0, users_validations_1.isUserValid)({
                email: 'user2@mail.com',
                first_name: 'fst',
                last_name: 'lst',
                pwd: 'P@ssw0rd',
                user_role: 'Sales',
            })).toBe('valid');
        });
        it('should be invalid (missing first_name)', () => {
            expect((0, users_validations_1.isUserValid)({
                email: 'user2@mail.com',
                first_name: '',
                last_name: 'lst',
                pwd: 'P@ssw0rd',
                user_role: 'Sales',
            })).toBe('First name must be provided.');
        });
        it('should be invalid (invalid user_role)', () => {
            expect((0, users_validations_1.isUserValid)({
                email: 'user2@mail.com',
                first_name: 'fst',
                last_name: 'lst',
                pwd: 'P@ssw0rd',
                user_role: 'Super Admin',
            })).toBe("User role can only be 'Admin' or 'Sales'.");
        });
    });
    describe('isValidLogin', () => {
        it('should be valid (email & password are provided)', () => {
            expect((0, users_validations_1.isValidLogin)('user2@mail.com', 'P@ssw0rd')).toBe('valid');
        });
        it('should be invalid (missing password)', () => {
            expect((0, users_validations_1.isValidLogin)('user2@mail.com', '')).toBe('Password must be provided.');
        });
    });
});
