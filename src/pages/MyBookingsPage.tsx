import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookingService } from '../services/api';
import { IBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST_OR_CANCELLED'>('UPCOMING');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<IBooking | null>(null);

  // Cancellation feedback modal/toast
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellationMessage, setCancellationMessage] = useState<string | null>(null);
  const [cancellationError, setCancellationError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await BookingService.getMyBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 text-slate-100 min-h-screen">
        <div className="w-16 h-16 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Sign In to View Bookings</h2>
        <p className="text-xs text-slate-400">
          Access your digital QR movie tickets, seating receipts, and cancellation options.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white transition shadow-lg shadow-rose-600/30"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Filter bookings into Upcoming vs Past/Cancelled
  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    if (b.bookingStatus === 'CANCELLED') return false;
    // Check if showDate is today or future
    const showDateObj = new Date(b.showDate);
    return showDateObj >= new Date(now.toDateString());
  });

  const pastOrCancelled = bookings.filter(b => {
    if (b.bookingStatus === 'CANCELLED') return true;
    const showDateObj = new Date(b.showDate);
    return showDateObj < new Date(now.toDateString());
  });

  const displayList = activeTab === 'UPCOMING' ? upcomingBookings : pastOrCancelled;

  // Handle cancellation
  const handleCancelBooking = async (booking: IBooking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingId}? 100% refund of ₹${booking.totalAmount} will be initiated.`)) {
      return;
    }

    try {
      setCancellingId(booking._id);
      setCancellationError(null);
      const res = await BookingService.cancelBooking(booking.bookingId);
      if (res.success) {
        setCancellationMessage(
          `Booking ${booking.bookingId} cancelled successfully! 100% Refund of ₹${res.refund?.amount || booking.totalAmount} has been initiated to your account.`
        );
        fetchBookings();
      }
    } catch (err: any) {
      setCancellationError(err.response?.data?.message || err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-rose-500" />
            <span>My Cinema Bookings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'UPCOMING'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Upcoming Shows</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 font-mono">
              {upcomingBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PAST_OR_CANCELLED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'PAST_OR_CANCELLED'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Past & Cancelled</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 font-mono">
              {pastOrCancelled.length}
            </span>
          </button>
        </div>
      </div>

      {/* Cancellation Alerts */}
      {cancellationMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-xs text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{cancellationMessage}</span>
          </div>
          <button
            onClick={() => setCancellationMessage(null)}
            className="text-xs text-emerald-400 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {cancellationError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{cancellationError}</span>
          </div>
          <button
            onClick={() => setCancellationError(null)}
            className="text-xs text-red-400 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Retrieving your ticket passes...</p>
        </div>
      ) : displayList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No {activeTab === 'UPCOMING' ? 'upcoming' : 'past or cancelled'} bookings found
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === 'UPCOMING'
              ? 'You have no movies scheduled. Ready for your next cinema adventure?'
              : 'Your past tickets and cancelled bookings will appear here.'}
          </p>
          {activeTab === 'UPCOMING' && (
            <Link
              to="/movies"
              className="inline-block px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition shadow-lg shadow-rose-600/30"
            >
              Browse Movies Now
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map(booking => {
            const isCancelled = booking.bookingStatus === 'CANCELLED';

            return (
              <div
                key={booking._id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {booking.bookingId}
                      </span>
                      {isCancelled ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-[10px] font-extrabold uppercase">
                          CANCELLED • REFUND INITIATED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[10px] font-extrabold uppercase">
                          CONFIRMED TICKET
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white">{booking.movieTitle}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{booking.theatreName} • {booking.screenName}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Total Paid
                    </span>
                    <span className="text-xl font-black text-rose-500 font-mono">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Show details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Date</span>
                      <span className="font-bold text-slate-200">{booking.showDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Time</span>
                      <span className="font-bold text-slate-200">{booking.showTime}</span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Seats ({booking.seats.length})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {booking.seats.map(s => (
                        <span
                          key={s.seatNumber}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-200"
                        >
                          {s.seatNumber} ({s.category})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cancellation refund status banner if cancelled */}
                {isCancelled && (
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-xs text-red-300 flex items-center justify-between">
                    <div>
                      <strong>Refund Status:</strong> 100% Refund (₹{booking.totalAmount}) Initiated. Refund ID: <span className="font-mono">{booking.refundId || 'REF-ACTIVE'}</span>.
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      In Process
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {!isCancelled && (
                    <button
                      type="button"
                      disabled={cancellingId === booking._id}
                      onClick={() => handleCancelBooking(booking)}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-slate-800 hover:border-red-800/60 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedBookingForModal(booking)}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Ticket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal popup */}
      <TicketModal
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
      />
    </div>
  );
};
