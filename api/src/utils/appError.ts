import { StatusCodes } from 'http-status-codes';

export default class AppError extends Error {
  name: string;
  isOperational: boolean;
  status: string;
  statusCode: number;
  code: number;
  flag: string;
  constructor(message: string, statusCode: number, name?: string, flag?: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.isOperational = true;
    this.flag = flag;

    Error.captureStackTrace(this, this.constructor);
  }
}
