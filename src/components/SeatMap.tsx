import React from 'react';
import { ISeatState } from '../types';
import { Tv, Armchair, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  seats: ISeatState[];
  selectedSeatNumbers: string[];
  onToggleSeat: (seat: ISeatState) => void;
  maxSeats?: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatNumbers,
  onToggleSeat,
  maxSeats = 10
}) => {
  // Group seats by row
  const rows = ['F', 'E', 'D', 'C', 'B', 'A']; // Recliners at back or front; in modern cinemas F is back luxury or A front
  // Let's display rows: F (Recliner), then E, D, C (Premium), then B, A (Regular), with screen at the bottom or top
  // As requested:
  //           SCREEN
  // A1 A2 A3...
  // B1 B2 B3...
  // C1 C2 C3...
  // D1 D2 D3...
  // E1 E2 E3...
  // F1 F2 F3...
  const displayRows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatColor = (seat: ISeatState) => {
    const isSelected = selectedSeatNumbers.includes(seat.seatNumber);

    if (seat.status === 'BOOKED') {
      return 'bg-slate-800/60 text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50';
    }

    if (isSelected) {
      return 'bg-gradient-to-t from-emerald-600 to-emerald-500 text-white font-bold border border-emerald-400 shadow-md shadow-emerald-600/40 scale-105 transition-transform';
    }

    // Available categories
    switch (seat.category) {
      case 'Recliner':
        return 'bg-amber-950/40 border border-amber-500/50 text-amber-200 hover:bg-amber-600/30 hover:border-amber-400 hover:scale-105 transition';
      case 'Premium':
        return 'bg-rose-950/40 border border-rose-500/50 text-rose-200 hover:bg-rose-600/30 hover:border-rose-400 hover:scale-105 transition';
      default:
        return 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:scale-105 transition';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Curved Screen Visualization */}
      <div className="w-full max-w-2xl mb-10 flex flex-col items-center">
        <div className="relative w-full h-12 flex items-center justify-center">
          <div className="w-3/4 h-3 rounded-t-[100%] bg-gradient-to-b from-rose-500/80 via-rose-500/40 to-transparent shadow-[0_-8px_20px_rgba(244,63,94,0.4)]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
          <Tv className="w-4 h-4 text-rose-500" />
          <span>All Eyes This Way • Cinema Screen</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="w-full max-w-3xl overflow-x-auto pb-4">
        <div className="min-w-[620px] flex flex-col gap-3 items-center">
          {displayRows.map((rowName) => {
            const rowSeats = seats
              .filter(s => s.row === rowName)
              .sort((a, b) => a.number - b.number);

            const categoryName = rowSeats[0]?.category || 'Regular';
            const categoryPrice = rowSeats[0]?.price || 220;

            return (
              <div key={rowName} className="w-full flex flex-col gap-1.5 items-center">
                {/* Category header for first row of that tier */}
                {(rowName === 'A' || rowName === 'C' || rowName === 'F') && (
                  <div className="w-full flex items-center justify-between px-6 text-xs text-slate-400 pt-3 pb-1 border-t border-slate-800/60 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Armchair className="w-3.5 h-3.5 text-rose-400" />
                      <strong className="text-slate-200">{categoryName} Class</strong>
                    </span>
                    <span className="font-semibold text-rose-400">₹{categoryPrice}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Row Letter */}
                  <span className="w-6 text-center text-xs font-bold text-slate-500">
                    {rowName}
                  </span>

                  {/* Left block (1-5) */}
                  <div className="flex items-center gap-2">
                    {rowSeats.slice(0, 5).map(seat => {
                      const isBooked = seat.status === 'BOOKED';
                      return (
                        <button
                          key={seat._id}
                          type="button"
                          disabled={isBooked}
                          onClick={() => onToggleSeat(seat)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-semibold flex items-center justify-center ${getSeatColor(seat)}`}
                          title={`Seat ${seat.seatNumber} • ${seat.category} (₹${seat.price})`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>

                  {/* Walkway Aisle */}
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter">||</span>
                  </div>

                  {/* Right block (6-10) */}
                  <div className="flex items-center gap-2">
                    {rowSeats.slice(5, 10).map(seat => {
                      const isBooked = seat.status === 'BOOKED';
                      return (
                        <button
                          key={seat._id}
                          type="button"
                          disabled={isBooked}
                          onClick={() => onToggleSeat(seat)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-semibold flex items-center justify-center ${getSeatColor(seat)}`}
                          title={`Seat ${seat.seatNumber} • ${seat.category} (₹${seat.price})`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row Letter right */}
                  <span className="w-6 text-center text-xs font-bold text-slate-500">
                    {rowName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Max seats warning */}
      {selectedSeatNumbers.length >= maxSeats && (
        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Maximum {maxSeats} seats can be selected per transaction.</span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500 border border-emerald-400 shadow-sm shadow-emerald-500/50" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800/60 border border-slate-700/40 opacity-50" />
          <span>Booked / Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-950/40 border border-amber-500/50" />
          <span>Recliner Suite</span>
        </div>
      </div>
    </div>
  );
};
