import { Router } from 'express';
import { getCities, getCityBySlug } from '../controllers/cityController.js';

export const cityRoutes = Router();

cityRoutes.get('/', getCities);
cityRoutes.get('/:slug', getCityBySlug);
