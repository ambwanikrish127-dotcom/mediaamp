import { Router } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', authenticate as any, requireAdmin as any, createMovie);
router.put('/:id', authenticate as any, requireAdmin as any, updateMovie);
router.delete('/:id', authenticate as any, requireAdmin as any, deleteMovie);

export default router;
