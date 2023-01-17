import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/user.model';
import config from '../config';
import { handleToken, isAdmin } from '../middleware/authentication.middleware';
import Error from '../interfaces/error.interface';
import { isValidLogin } from '../validations/users.validations';

const userModel = new UserModel();

const isCurrentUser = (req: Request): boolean => {
  let id: string = req.params.id as unknown as string;
  if (!id) id = req.body.id;

  const tokenDetails: JwtPayload = handleToken(req) as JwtPayload;
  const loggedId: string = tokenDetails.user.id as string;

  if (id !== loggedId) return false;

  return true;
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.create(req.body);
    res.json({
      status: 'success',
      data: { ...user },
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  if (!isAdmin(req)) {
    const err: Error = new Error("You don't have permission to get all users.");
    err.status = 401;
    next(err);
    return;
  }
  try {
    const user = await userModel.getAll();
    res.json({
      status: 'success',
      data: user,
      message: 'Users returned successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  if (!isCurrentUser(req)) {
    const err: Error = new Error("You don't have permission to view this user.");
    err.status = 401;
    next(err);
    return;
  }
  try {
    const id: string = req.params.id as unknown as string;
    const user = await userModel.getById(id);
    res.json({
      status: 'success',
      data: user,
      message: 'User returned successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!isCurrentUser(req)) {
    const err: Error = new Error("You don't have permission to update this user.");
    err.status = 401;
    next(err);
    return;
  }
  try {
    const user = await userModel.updateUser(req.body);
    res.json({
      status: 'success',
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!isCurrentUser(req)) {
    const err: Error = new Error("You don't have permission to delete this user.");
    err.status = 401;
    next(err);
    return;
  }
  try {
    const user = await userModel.deleteUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const validationResult = isValidLogin(email, password);
    if (validationResult !== 'valid') {
      const err: Error = new Error(validationResult);
      err.status = 400;
      next(err);
      return;
    }
    const user = await userModel.authenticateUser(email, password);
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect credetials, please try again.',
      });
    }
    return res.json({
      status: 'success',
      data: { ...user, token },
      message: 'Successful Login',
    });
  } catch (error) {
    next(error);
  }
};
