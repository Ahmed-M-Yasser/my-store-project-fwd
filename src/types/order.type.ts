import OrderDetails from './orderProduct.type';

type ORDER = {
  id?: string;
  total: number;
  order_date: Date;
  user_id: string;
  order_status: string;
};

type OrderVM = {
  orderMaster: ORDER;
  orderDetails: OrderDetails[];
};

export { ORDER, OrderVM };
