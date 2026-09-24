import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { BookingService } from '../services/api';
import { IBooking } from '../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Film,
  Popcorn,
  Printer,
  Ticket,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [booking, setBooking] = useState<IBooking | null>(
    (location.state as any)?.booking || null
  );
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!booking && id) {
      BookingService.getBookingById(id)
        .then(res => {
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to load booking details.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading your digital cinema ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-100 space-y-4">
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Could not locate this ticket.'}</p>
        <Link to="/my-bookings" className="inline-block px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  const qrPayload = JSON.stringify({
    bookingId: booking.bookingId,
    movie: booking.movieTitle,
    theatre: booking.theatreName,
    date: booking.showDate,
    time: booking.showTime,
    seats: booking.seats.map(s => s.seatNumber),
    amount: booking.totalAmount,
    status: booking.bookingStatus
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-slate-100 min-h-screen">
      {/* Confirmation Top Badge */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase">
          BOOKING CONFIRMED ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Your Cinema Ticket is Ready!
        </h1>
        <p className="text-xs text-slate-400">
          A confirmation receipt has been issued. Show the QR code below at the cinema entry gate.
        </p>
      </div>

      {/* Realistic Movie Ticket Card */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Ticket Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-b border-slate-800/80">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">
                Official E-Ticket
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{booking.theatreName} • {booking.screenName}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Booking ID
              </span>
              <span className="text-sm font-black font-mono text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {booking.bookingId}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Details Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date</span>
                <span className="text-white font-bold">{booking.showDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time</span>
                <span className="text-white font-bold">{booking.showTime}</span>
              </div>
            </div>
          </div>

          {/* Allocated Seats */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Reserved Seats ({booking.seats.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map(seat => (
                <div
                  key={seat.seatNumber}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <span className="text-rose-400">{seat.seatNumber}</span>
                  <span className="text-[10px] font-normal text-slate-400">({seat.category})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Snacks if ordered */}
          {booking.snacks && booking.snacks.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Popcorn className="w-4 h-4" />
                <span>Pre-Ordered Concessions</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {booking.snacks.map((snack, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{snack.quantity} × {snack.name}</span>
                    <span className="text-slate-400">₹{snack.price * snack.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tear-off dotted line */}
          <div className="relative py-2 flex items-center justify-between">
            <div className="w-5 h-10 bg-slate-950 rounded-r-full -ml-6 border-r border-slate-800" />
            <div className="flex-1 border-t-2 border-dashed border-slate-800 mx-2" />
            <div className="w-5 h-10 bg-slate-950 rounded-l-full -mr-6 border-l border-slate-800" />
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
              <QRCodeSVG
                value={qrPayload}
                size={130}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="text-center sm:text-right space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Amount Paid
              </span>
              <div className="text-3xl font-black text-rose-500 font-mono">
                ₹{booking.totalAmount}
              </div>
              <p className="text-[11px] text-slate-400">
                Show this barcode to the usher at cinema entrance
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Digital Cinema Pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Ticket</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/my-bookings"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Bookings</span>
            </Link>

            <Link
              to="/"
              className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1"
            >
              <span>Explore More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
