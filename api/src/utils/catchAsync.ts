import { type Request, type Response, NextFunction } from 'express';

export const catchAsync = (fn) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
