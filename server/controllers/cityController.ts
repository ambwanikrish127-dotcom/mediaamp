import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getCities(req: Request, res: Response): Promise<void> {
  try {
    const { search } = req.query;
    const cities = await DataStore.getCities(search as string);
    res.json({
      success: true,
      count: cities.length,
      cities
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch cities.', error: err.message });
  }
}

export async function getCityBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const city = await DataStore.getCityBySlug(slug);
    if (!city) {
      res.status(404).json({ success: false, message: 'City not found.' });
      return;
    }
    res.json({ success: true, city });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch city details.', error: err.message });
  }
}
