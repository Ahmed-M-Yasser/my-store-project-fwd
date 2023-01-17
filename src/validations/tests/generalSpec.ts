import { isIdValid } from '../general.validations';

describe('validations/generalSpec', () => {
  describe('isIdValid', () => {
    it('should be valid (c2299c82-e65a-478a-8fee-24fa9b49109e)', () => {
      expect(isIdValid('c2299c82-e65a-478a-8fee-24fa9b49109e', 'test')).toBe('valid');
    });
    it('should be invalid ()', () => {
      expect(isIdValid('', 'test')).not.toBe('valid');
    });
  });
});
