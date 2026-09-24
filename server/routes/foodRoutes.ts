import { Router } from 'express';
import { getFoodItems } from '../controllers/foodController.js';

const router = Router();

router.get('/', getFoodItems);

export default router;
