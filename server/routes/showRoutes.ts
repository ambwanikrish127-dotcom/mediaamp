import { Router } from 'express';
import { getShows, getShowById, createShow } from '../controllers/showController.js';
import { getSeatsForShow, lockSeats, unlockSeats } from '../controllers/seatController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Shows
router.get('/', getShows);
router.get('/:id', getShowById);
router.post('/', authenticate as any, requireAdmin as any, createShow);

// Seats
router.get('/:showId/seats', getSeatsForShow as any);
router.post('/:showId/lock-seats', lockSeats as any);
router.post('/:showId/unlock-seats', unlockSeats as any);

export default router;
