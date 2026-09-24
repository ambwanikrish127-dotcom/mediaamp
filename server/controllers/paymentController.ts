import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';

export async function createPaymentOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { amount, currency = 'INR', bookingReference } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid payment amount.' });
      return;
    }

    // Mock order structure matching Razorpay / Stripe payload
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      mode: 'TEST_SIMULATED',
      order: {
        id: orderId,
        amount,
        currency,
        bookingReference: bookingReference || 'TEMP_REF',
        keyId: 'rzp_test_cinebook_demo_mode'
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error initiating payment order.' });
  }
}

export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Simulated verification logic
    res.json({
      success: true,
      verified: true,
      transactionId: paymentId || `TXN_${Date.now()}`,
      message: 'Demo payment successfully verified.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
}
