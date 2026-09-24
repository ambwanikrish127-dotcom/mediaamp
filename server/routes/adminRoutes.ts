import { Router } from 'express';
import { getAdminDashboardStats, getAllBookingsAdmin } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate as any, requireAdmin as any, getAdminDashboardStats as any);
router.get('/bookings', authenticate as any, requireAdmin as any, getAllBookingsAdmin as any);

export default router;
