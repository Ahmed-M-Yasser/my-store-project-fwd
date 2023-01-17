import PRODUCT from '../types/product.type';

export const isProductValid = (p: PRODUCT): string => {
  try {
    const parsedPrice = parseFloat(p.price as unknown as string);

    if (p.product_name === '') return 'Product name must be provided.';
    else if (!parsedPrice || parsedPrice <= 0) return 'Invalid price value.';

    return 'valid';
  } catch (error) {
    throw new Error('Bad request: ' + (error as Error).message + '.');
  }
};
