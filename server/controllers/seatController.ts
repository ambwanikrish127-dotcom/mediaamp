import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getSeatsForShow(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { showId } = req.params;
    const sessionToken = (req.query.sessionToken as string) || (req.user ? req.user.id : '');

    const result = await DataStore.getSeatsForShow(showId, sessionToken);
    if (!result) {
      res.status(404).json({ success: false, message: 'Show not found.' });
      return;
    }

    res.json({
      success: true,
      show: result.show,
      seats: result.seats
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load seats.', error: err.message });
  }
}

export async function lockSeats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { showId } = req.params;
    const { seats, sessionToken } = req.body;

    if (!Array.isArray(seats)) {
      res.status(400).json({ success: false, message: 'Seats array is required.' });
      return;
    }

    if (seats.length > 10) {
      res.status(400).json({ success: false, message: 'Maximum 10 seats allowed per booking.' });
      return;
    }

    const userIdOrSession = req.user ? req.user.id : (sessionToken || 'guest_session');

    if (seats.length === 0) {
      await DataStore.unlockSeats(showId, userIdOrSession);
      res.json({ success: true, message: 'Seats cleared.', lockedSeats: [] });
      return;
    }

    const lockResult = await DataStore.lockSeats(showId, seats, userIdOrSession);
    res.json({
      success: true,
      message: 'Seats held for 5 minutes.',
      lockedSeats: lockResult.lockedSeats,
      lockedUntil: lockResult.lockedUntil
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Could not lock seats.' });
  }
}

export async function unlockSeats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { showId } = req.params;
    const { sessionToken } = req.body;
    const userIdOrSession = req.user ? req.user.id : (sessionToken || 'guest_session');

    await DataStore.unlockSeats(showId, userIdOrSession);
    res.json({ success: true, message: 'Seats released successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to release seats.', error: err.message });
  }
}
