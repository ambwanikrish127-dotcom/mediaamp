import { Response } from 'express';
import { DataStore } from '../services/dataStore.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getAdminDashboardStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await DataStore.getAdminStats();
    res.json({
      success: true,
      stats
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate admin statistics.', error: err.message });
  }
}

export async function getAllBookingsAdmin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const bookings = await DataStore.getAllBookings();
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all bookings.', error: err.message });
  }
}
