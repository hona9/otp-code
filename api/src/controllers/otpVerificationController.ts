import { type Request, type Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { validationResult } from 'express-validator';
import AppError from '../utils/appError';
import { StatusCodes } from 'http-status-codes';

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ status: 'error', errors: errors.array() });
  }

  const { code } = req.body;
  if (code[5] === '7') {
    throw new AppError('Verification Error', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({ status: 'success', message: 'Verification Successful' });
});

export default { verifyOTP };
