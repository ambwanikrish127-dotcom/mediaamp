import { Response } from 'express';
import { DataStore } from '../services/dataStore.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please login to book tickets.' });
      return;
    }

    const { showId, seatNumbers, snacks, sessionToken } = req.body;

    if (!showId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({ success: false, message: 'Please provide a valid showId and at least one seat.' });
      return;
    }

    if (seatNumbers.length > 10) {
      res.status(400).json({ success: false, message: 'Maximum 10 seats allowed per booking.' });
      return;
    }

    const booking = await DataStore.createBooking({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      showId,
      seatNumbers,
      snacks: snacks || [],
      sessionToken: sessionToken || req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Booking failed due to availability or server error.'
    });
  }
}

export async function getMyBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const bookings = await DataStore.getBookingsByUser(req.user.id, req.user.email);
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.', error: err.message });
  }
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const booking = await DataStore.getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Access check: User must own the booking or be admin
    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied to this booking.' });
      return;
    }

    res.json({
      success: true,
      booking
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking details.', error: err.message });
  }
}

export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';

    const result = await DataStore.cancelBooking(id, req.user.id, isAdmin);

    res.json({
      success: true,
      message: 'Booking cancelled successfully. 100% refund has been initiated.',
      booking: result.booking,
      refund: result.refund
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Unable to cancel booking.'
    });
  }
}
