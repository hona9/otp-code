import { Router } from 'express';
import otpVerificationController from '../controllers/otpVerificationController';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/verify',
  [
    body('code')
      .isLength({ min: 6, max: 6 })
      .withMessage('Code must be exactly 6 digits')
      .isNumeric()
      .withMessage('Code must contain only numbers')
  ],
  otpVerificationController.verifyOTP
);

export default router;
