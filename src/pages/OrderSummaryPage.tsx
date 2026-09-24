import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  Popcorn,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  Lock
} from 'lucide-react';

export const OrderSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();

  const [draft, setDraft] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [error, setError] = useState<string | null>(null);

  // Quick inline login state if guest
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = sessionStorage.getItem('cinebook_booking_draft');
    if (!savedDraft) {
      navigate('/movies');
      return;
    }
    setDraft(JSON.parse(savedDraft));
  }, [navigate]);

  if (!draft) {
    return null;
  }

  const show = draft.show;
  const seats = draft.selectedSeats || [];
  const snacks = draft.snacks || [];
  const ticketAmount = draft.ticketAmount || 0;
  const snackAmount = draft.snackAmount || 0;
  const convenienceFee = 40;
  const discount = 0;
  const totalAmount = ticketAmount + snackAmount + convenienceFee - discount;

  // Handle inline quick login for convenience
  const handleQuickDemoLogin = async (asAdmin = false) => {
    const email = asAdmin ? 'admin@cinebook.com' : 'user@cinebook.com';
    const pass = asAdmin ? 'Admin@123' : 'User@123';
    const res = await login(email, pass);
    if (!res.success) {
      setAuthError(res.message || 'Login failed');
    } else {
      setAuthError(null);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Email and password are required');
      return;
    }
    const res = await login(authEmail, authPassword);
    if (!res.success) {
      setAuthError(res.message || 'Invalid credentials');
    } else {
      setAuthError(null);
    }
  };

  // Complete Booking & Payment
  const handleConfirmAndPay = async () => {
    if (!isAuthenticated) {
      setError('Please sign in or use 1-Click Demo Login to confirm your booking.');
      return;
    }

    try {
      setError(null);
      setPaymentStep('PROCESSING');
      setProcessing(true);

      // Simulate payment network roundtrip
      await new Promise(resolve => setTimeout(resolve, 1400));

      const response = await BookingService.createBooking({
        showId: draft.showId,
        seatNumbers: draft.seatNumbers,
        snacks: (draft.snacks || []).map((s: any) => ({
          foodItemId: s.foodItemId,
          quantity: s.quantity
        }))
      });

      if (response.success && response.booking) {
        setPaymentStep('SUCCESS');
        // Clear draft
        sessionStorage.removeItem('cinebook_booking_draft');

        // Short timeout for success animation then navigate to ticket
        setTimeout(() => {
          navigate(`/booking/${response.booking.bookingId}`, {
            state: { booking: response.booking }
          });
        }, 800);
      }
    } catch (err: any) {
      setPaymentStep('REVIEW');
      setProcessing(false);
      setError(err.response?.data?.message || err.message || 'Booking payment could not be processed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100 min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Snacks</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Review & Complete Booking
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify your movie session details, seat allocations, and finalize your order.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Order Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Movie Session Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                <img
                  src={show?.moviePoster || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300'}
                  alt={show?.movieTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {show?.movieTitle}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{show?.theatreName} • {show?.screenName} ({show?.screenType || 'Dolby Atmos'})</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {show?.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {show?.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Seats Table */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Seat Allocations ({seats.length})
              </div>
              <div className="space-y-1.5">
                {seats.map((seat: any) => (
                  <div key={seat.seatNumber} className="flex items-center justify-between text-xs">
                    <span className="text-slate-200">
                      Seat <strong className="text-white font-mono">{seat.seatNumber}</strong> ({seat.category} Class)
                    </span>
                    <span className="font-mono text-slate-300">₹{seat.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Snacks Table */}
            {snacks.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Popcorn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Concessions & Snacks ({snacks.length})</span>
                </div>
                <div className="space-y-1.5">
                  {snacks.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-200">
                        {s.quantity} × {s.name}
                      </span>
                      <span className="font-mono text-slate-300">₹{s.price * s.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authentication Check: If not signed in */}
          {!isAuthenticated && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Account Required to Finalize Tickets</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tickets are tied to your user account for instant retrieval, QR entry passes, and cancellation refunds.
              </p>

              {/* 1-Click Demo Logins */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">
                  Fast Demo Access:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>⚡ 1-Click Demo User (John Doe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>👑 1-Click Admin</span>
                  </button>
                </div>
              </div>

              {/* Or manual form */}
              <form onSubmit={handleCustomLogin} className="pt-3 border-t border-slate-800 space-y-3">
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}

          {/* User Confirmation Banner if logged in */}
          {isAuthenticated && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Booking for: <strong className="text-white">{user?.name}</strong> ({user?.email})
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full">
                Authenticated
              </span>
            </div>
          )}
        </div>

        {/* Right Col: Price Breakdown & Simulated Payment */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Payment Summary
            </h3>

            {/* Line Items */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-white">₹{ticketAmount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Snacks & Concessions</span>
                <span className="font-mono text-white">₹{snackAmount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Integrated Convenience Fee</span>
                <span className="font-mono text-white">₹{convenienceFee}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Promotional Discount</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-white">Final Total Amount</span>
                <span className="text-2xl font-black text-rose-500 font-mono">₹{totalAmount}</span>
              </div>
            </div>

            {/* Demo Payment Notice */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                <span>Demo Payment / Test Mode</span>
              </div>
              <p>
                Simulated zero-risk payment gateway ready for live production Razorpay credentials.
              </p>
            </div>

            {/* Payment Button with Animated Steps */}
            <button
              type="button"
              disabled={processing}
              onClick={handleConfirmAndPay}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-xl ${
                paymentStep === 'PROCESSING'
                  ? 'bg-amber-600 text-white cursor-wait'
                  : paymentStep === 'SUCCESS'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {paymentStep === 'PROCESSING' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment ₹{totalAmount}...</span>
                </>
              ) : paymentStep === 'SUCCESS' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Successful! Generating Ticket...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmount}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit Encrypted Cinema Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
