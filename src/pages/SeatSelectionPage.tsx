import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShowService } from '../services/api';
import { IShow, ISeatState } from '../types';
import { SeatMap } from '../components/SeatMap';
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Armchair,
  Timer
} from 'lucide-react';

export const SeatSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // showId
  const navigate = useNavigate();

  const [show, setShow] = useState<IShow | null>(null);
  const [seats, setSeats] = useState<ISeatState[]>([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState<number | null>(null);

  const lockTimerRef = useRef<any>(null);

  // Load show and current seat layout
  const loadShowSeats = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ShowService.getSeats(id);
      if (res.success) {
        setShow(res.show);
        setSeats(res.seats);

        // If user already had pre-locked seats, select them
        const preSelected = res.seats
          .filter((s: ISeatState) => s.status === 'SELECTED' && s.isLockedByMe)
          .map((s: ISeatState) => s.seatNumber);

        if (preSelected.length > 0) {
          setSelectedSeatNumbers(preSelected);
          startLockTimer(300); // 5 mins
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load theater seat map.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShowSeats();

    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [id]);

  const startLockTimer = (seconds: number) => {
    if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    setLockSecondsRemaining(seconds);

    lockTimerRef.current = setInterval(() => {
      setLockSecondsRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(lockTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Toggle seat selection
  const handleToggleSeat = async (seat: ISeatState) => {
    if (seat.status === 'BOOKED') return;

    const isCurrentlySelected = selectedSeatNumbers.includes(seat.seatNumber);
    let updatedSelection: string[];

    if (isCurrentlySelected) {
      updatedSelection = selectedSeatNumbers.filter(s => s !== seat.seatNumber);
    } else {
      if (selectedSeatNumbers.length >= 10) {
        setError('Maximum 10 seats allowed per booking.');
        return;
      }
      updatedSelection = [...selectedSeatNumbers, seat.seatNumber];
    }

    setSelectedSeatNumbers(updatedSelection);
    setError(null);

    // Sync temporary seat lock with backend
    if (id) {
      try {
        const res = await ShowService.lockSeats(id, updatedSelection);
        if (res.success) {
          if (updatedSelection.length > 0) {
            startLockTimer(300); // 5 minutes fresh lock
          } else {
            setLockSecondsRemaining(null);
            if (lockTimerRef.current) clearInterval(lockTimerRef.current);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Selected seat is no longer available.');
        // Refresh seats to update state
        loadShowSeats();
      }
    }
  };

  // Calculate ticket amount
  const selectedSeatObjects = seats.filter(s => selectedSeatNumbers.includes(s.seatNumber));
  const ticketTotal = selectedSeatObjects.reduce((acc, s) => acc + s.price, 0);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Proceed to Snacks
  const handleProceed = () => {
    if (selectedSeatNumbers.length === 0) {
      setError('Please select at least 1 seat to proceed.');
      return;
    }

    // Save booking draft to sessionStorage
    const bookingDraft = {
      showId: id,
      show,
      seatNumbers: selectedSeatNumbers,
      selectedSeats: selectedSeatObjects,
      ticketAmount: ticketTotal
    };
    sessionStorage.setItem('cinebook_booking_draft', JSON.stringify(bookingDraft));

    navigate('/snacks');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading theater seating layout and live availability...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-32">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{show?.movieTitle}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {show?.certification}
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{show?.theatreName} • {show?.screenName}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-white font-semibold">{show?.date} at {show?.time}</span>
              </p>
            </div>
          </div>

          {/* Seat Hold Timer */}
          {lockSecondsRemaining !== null && lockSecondsRemaining > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-semibold animate-pulse">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Seats locked for:</span>
              <span className="font-mono text-white text-sm font-extrabold">{formatTimer(lockSecondsRemaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Seat Map Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <SeatMap
          seats={seats}
          selectedSeatNumbers={selectedSeatNumbers}
          onToggleSeat={handleToggleSeat}
          maxSeats={10}
        />
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected seats info */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Selected Seats ({selectedSeatNumbers.length})
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 max-w-sm">
                {selectedSeatNumbers.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No seats selected yet</span>
                ) : (
                  selectedSeatNumbers.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Amount & CTA Button */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Tickets Subtotal
              </span>
              <span className="text-2xl font-black text-rose-500">
                ₹{ticketTotal}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeatNumbers.length === 0}
              onClick={handleProceed}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-xl ${
                selectedSeatNumbers.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <span>Continue to Snacks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
