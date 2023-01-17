import { isUserValid, isValidLogin } from '../users.validations';
import User from '../../types/user.type';

describe('validations/userSpec', () => {
  describe('isUserValid', () => {
    it('should be valid (All details are provided)', () => {
      expect(
        isUserValid({
          email: 'user2@mail.com',
          first_name: 'fst',
          last_name: 'lst',
          pwd: 'P@ssw0rd',
          user_role: 'Sales',
        } as User)
      ).toBe('valid');
    });
    it('should be invalid (missing first_name)', () => {
      expect(
        isUserValid({
          email: 'user2@mail.com',
          first_name: '',
          last_name: 'lst',
          pwd: 'P@ssw0rd',
          user_role: 'Sales',
        } as User)
      ).toBe('First name must be provided.');
    });
    it('should be invalid (invalid user_role)', () => {
      expect(
        isUserValid({
          email: 'user2@mail.com',
          first_name: 'fst',
          last_name: 'lst',
          pwd: 'P@ssw0rd',
          user_role: 'Super Admin',
        } as User)
      ).toBe("User role can only be 'Admin' or 'Sales'.");
    });
  });
  describe('isValidLogin', () => {
    it('should be valid (email & password are provided)', () => {
      expect(isValidLogin('user2@mail.com', 'P@ssw0rd')).toBe('valid');
    });
    it('should be invalid (missing password)', () => {
      expect(isValidLogin('user2@mail.com', '')).toBe('Password must be provided.');
    });
  });
});
