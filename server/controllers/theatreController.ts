import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getAllTheatres(req: Request, res: Response): Promise<void> {
  try {
    const theatres = await DataStore.getTheatres();
    res.json({ success: true, count: theatres.length, theatres });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch theatres.', error: err.message });
  }
}

export async function createTheatre(req: Request, res: Response): Promise<void> {
  try {
    const { name, city, location, totalScreens } = req.body;
    if (!name || !city || !location) {
      res.status(400).json({ success: false, message: 'Theatre name, city, and location are required.' });
      return;
    }

    const theatre = await DataStore.createTheatre({
      name,
      city,
      location,
      totalScreens: totalScreens || 2
    });

    res.status(201).json({ success: true, message: 'Theatre registered successfully.', theatre });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create theatre.', error: err.message });
  }
}
