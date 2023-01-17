import { NextFunction, Request, Response } from 'express';
import ProductModel from '../models/product.model';
import { isAdmin } from '../middleware/authentication.middleware';
import Error from '../interfaces/error.interface';

const productModel = new ProductModel();

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productModel.getAll();
    res.json({
      status: 'success',
      data: products,
      message: 'Products returned successfully.',
    });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.getById(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: product,
      message: 'Product returned successfully.',
    });
  } catch (error) {
    next(error);
  }
};
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isAdmin(req)) {
      const err: Error = new Error("You don't have permission to create new product.");
      err.status = 401;
      next(err);
      return;
    }
    const product = await productModel.create(req.body);
    res.json({
      status: 'success',
      data: product,
      message: 'Product created successfully.',
    });
  } catch (error) {
    next(error);
  }
};
