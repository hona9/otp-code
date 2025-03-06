import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';

const sendError = (error: AppError, req: Request, res: Response, _next: NextFunction) => {
  const ENV = process.env.ENV;

  const customError = {
    ...error,
    name: error.name,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack
  };

  if (!customError.isOperational) {
    console.log(customError.message, {
      metadata: { ...customError, ip: req.ip, app: req.app.locals.title }
    });
  }

  interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
  }

  const errorResponse: ErrorResponse = {
    ...customError,
    status: customError.status,
    message: customError.message
  };

  if (ENV === 'development') {
    errorResponse.stack = customError.stack;
  }
  console.error(errorResponse);

  return res
    .status(customError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
};

export const handler = (error: AppError, req: Request, res: Response, next: NextFunction): void => {
  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';
  sendError(error, req, res, next);
};
