import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import OrderModel from '../models/order.model';
import { handleToken, isAdmin } from '../middleware/authentication.middleware';
import Error from '../interfaces/error.interface';

const orderModel = new OrderModel();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenDetails: JwtPayload = handleToken(req) as JwtPayload;
    const userId: string = tokenDetails.user.id as string;

    const order = await orderModel.create(req.body, userId);
    res.json({
      status: 'success',
      data: { ...order },
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenDetails: JwtPayload = handleToken(req) as JwtPayload;
    const userId: string = tokenDetails.user.id as string;
    const orders = await orderModel.getAll(userId);
    res.json({
      status: 'success',
      data: orders,
      message: 'Orders returned successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenDetails: JwtPayload = handleToken(req) as JwtPayload;
    const userId: string = tokenDetails.user.id as string;
    const order = await orderModel.getById(userId, req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: order,
      message: 'Order returned successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  if (!isAdmin(req)) {
    const err: Error = new Error("You don't have permission to update this order.");
    err.status = 401;
    next(err);
    return;
  }
  try {
    const order = await orderModel.updateStatus(req.params.id, req.params.status);
    res.json({
      status: 'success',
      data: { ...order },
      message: 'Order updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
