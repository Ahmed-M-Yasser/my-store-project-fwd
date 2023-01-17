import { isProductValid } from '../products.validations';

describe('validations/productSpec', () => {
  describe('isProductValid', () => {
    it('should be valid (product_name & price are provided)', () => {
      expect(
        isProductValid({
          product_name: 'valid product 1',
          price: 2,
        })
      ).toBe('valid');
    });
    it('should be invalid (missing product_name)', () => {
      expect(
        isProductValid({
          product_name: '',
          price: 2,
        })
      ).not.toBe('valid');
    });
  });
});
