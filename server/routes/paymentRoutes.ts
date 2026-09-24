import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/create', authenticate as any, createPaymentOrder as any);
router.post('/verify', authenticate as any, verifyPayment as any);

export default router;
