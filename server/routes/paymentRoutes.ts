import { Router } from 'express';
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  handlePaymentWebhook
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/config', getPaymentConfig as any);
router.post('/create-order', authenticate as any, createPaymentOrder as any);
router.post('/create', authenticate as any, createPaymentOrder as any); // backwards compatibility
router.post('/verify', authenticate as any, verifyPayment as any);
router.post('/failure', authenticate as any, handlePaymentFailure as any);
router.post('/webhook', handlePaymentWebhook as any);

export default router;
