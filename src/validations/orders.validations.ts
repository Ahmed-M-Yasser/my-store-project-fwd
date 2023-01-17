import OrderProduct from '../types/orderProduct.type';

export const isOrderValid = (o: OrderProduct[]): string => {
  let result = 'valid',
    parsedDec;

  try {
    o.forEach((element) => {
      if (element.product_id === '') {
        result = 'Product id must be provided.';
        return;
      }

      parsedDec = parseFloat(element.qty as unknown as string);
      if (!parsedDec || parsedDec <= 0) {
        result = 'Invalid quantity value.';
        return;
      }
    });
    return result;
  } catch (error) {
    throw new Error('Bad request: ' + (error as Error).message + '.');
  }
};
export const isUpdateOrderValid = (orderId: unknown, orderStatus: unknown): string => {
  try {
    if (!orderId || orderId === '') return 'Order id must be provided.';
    else if (!orderStatus || (orderStatus as string) === '')
      return 'Order status must be provided.';
    else if (!(orderStatus === 'Confirmed' || orderStatus === 'Rejected'))
      return "Order status can only be 'Confirmed' or 'Rejected'.";

    return 'valid';
  } catch (error) {
    throw new Error('Bad request: ' + (error as Error).message + '.');
  }
};
