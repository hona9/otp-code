import { type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: number;
}

interface RateLimitRequest extends Request {
  rateLimit?: RateLimitInfo;
}

export const verifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req: RateLimitRequest, res: Response) => {
    const retryAfter = new Date(req.rateLimit.resetTime);
    const formattedTime = retryAfter.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kathmandu',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });

    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      status: StatusCodes.TOO_MANY_REQUESTS,
      message: `Too many verification requests, please try again after ${formattedTime}`
    });
  }
});
