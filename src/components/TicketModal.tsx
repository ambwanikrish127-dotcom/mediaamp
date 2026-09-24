import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IBooking } from '../types';
import { X, CheckCircle2, Calendar, Clock, MapPin, Film, Popcorn, Printer } from 'lucide-react';

interface TicketModalProps {
  booking: IBooking | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const qrData = JSON.stringify({
    bookingId: booking.bookingId,
    movie: booking.movieTitle,
    theatre: booking.theatreName,
    date: booking.showDate,
    time: booking.showTime,
    seats: booking.seats.map(s => s.seatNumber),
    total: booking.totalAmount,
    status: booking.bookingStatus
  });

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.bookingStatus === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Top Header Bar */}
        <div className={`p-4 text-center ${isCancelled ? 'bg-red-950/80 border-b border-red-800/60' : 'bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-emerald-800/40'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCancelled ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-900/60 px-2.5 py-1 rounded-full">
                  BOOKING CANCELLED (REFUND INITIATED)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  BOOKING CONFIRMED ✓
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-xs font-mono text-slate-400 tracking-wider">
            BOOKING ID: <span className="text-white font-bold text-sm">{booking.bookingId}</span>
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          {/* Movie details */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{booking.movieTitle}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{booking.theatreName} • {booking.screenName}</span>
              </p>
            </div>
          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                <span className="text-white font-semibold">{booking.showDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Show Time</span>
                <span className="text-white font-semibold">{booking.showTime}</span>
              </div>
            </div>
          </div>

          {/* Seats Allocation */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">Allocated Seats ({booking.seats.length})</span>
              <span className="text-rose-400 font-medium">₹{booking.ticketAmount}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <div
                  key={seat.seatNumber}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <span className="text-rose-400">{seat.seatNumber}</span>
                  <span className="text-[10px] font-normal text-slate-400">({seat.category})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Snacks if any */}
          {booking.snacks && booking.snacks.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Popcorn className="w-3.5 h-3.5 text-amber-400" />
                  Pre-ordered Concessions
                </span>
                <span className="text-amber-400 font-medium">₹{booking.snackAmount}</span>
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

          {/* Tear-off divider line */}
          <div className="relative py-2 flex items-center justify-between">
            <div className="w-4 h-8 bg-slate-950 rounded-r-full -ml-6 border-r border-slate-800" />
            <div className="flex-1 border-t-2 border-dashed border-slate-800 mx-2" />
            <div className="w-4 h-8 bg-slate-950 rounded-l-full -mr-6 border-l border-slate-800" />
          </div>

          {/* QR Code & Total */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="bg-white p-3 rounded-2xl shadow-md shrink-0">
              <QRCodeSVG
                value={qrData}
                size={110}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-center sm:text-right space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Grand Total Paid</span>
              <div className="text-3xl font-black text-rose-500">₹{booking.totalAmount}</div>
              <p className="text-[11px] text-slate-500">Scan at entrance scanner or counter</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
