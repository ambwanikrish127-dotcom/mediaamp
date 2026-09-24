import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate as any, createBooking as any);
router.get('/my', authenticate as any, getMyBookings as any);
router.get('/:id', authenticate as any, getBookingById as any);
router.post('/:id/cancel', authenticate as any, cancelBooking as any);

export default router;
