import { Router } from 'express';
import { getAllTheatres, createTheatre } from '../controllers/theatreController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllTheatres);
router.post('/', authenticate as any, requireAdmin as any, createTheatre);

export default router;
