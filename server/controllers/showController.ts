import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getShows(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, date, theatreId } = req.query;
    const shows = await DataStore.getShows({
      movieId: movieId as string,
      date: date as string,
      theatreId: theatreId as string
    });
    res.json({ success: true, count: shows.length, shows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch shows.', error: err.message });
  }
}

export async function getShowById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const show = await DataStore.getShowById(id);
    if (!show) {
      res.status(404).json({ success: false, message: 'Showtime not found.' });
      return;
    }
    res.json({ success: true, show });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch show details.', error: err.message });
  }
}

export async function createShow(req: Request, res: Response): Promise<void> {
  try {
    const { movieId, theatreId, screenId, date, time, prices } = req.body;
    if (!movieId || !theatreId || !screenId || !date || !time) {
      res.status(400).json({ success: false, message: 'Missing required show fields.' });
      return;
    }

    const show = await DataStore.createShow({
      movieId,
      theatreId,
      screenId,
      date,
      time,
      prices: prices || { Regular: 220, Premium: 340, Recliner: 520 }
    });

    res.status(201).json({ success: true, message: 'Show scheduled successfully.', show });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create show.', error: err.message });
  }
}
