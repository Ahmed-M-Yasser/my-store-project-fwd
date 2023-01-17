type OrderProduct = {
  id?: string;
  order_id?: string;
  product_id: string;
  qty: number;
  price?: number;
};

export default OrderProduct;
