import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Clock, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Cine<span className="text-rose-500">Book</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience movie magic with instant seat locking, high fidelity theater sound, contactless digital QR tickets, and hassle-free booking.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure Cinema Ticketing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/movies?status=NOW_SHOWING" className="hover:text-rose-400 transition">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=COMING_SOON" className="hover:text-rose-400 transition">
                  Coming Soon Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-rose-400 transition">
                  My Bookings & QR Passes
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition">
                  Admin Cinema Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience Formats */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Cinema Formats
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>IMAX with Laser 3D</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dolby Atmos Spatial Audio</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Gold Class Luxury Recliners</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>4DX Motion & Environmental</span>
              </li>
            </ul>
          </div>

          {/* Booking Assurance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Promise
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">Cancellation Window:</strong> Free cancellation allowed up to 30 mins before showtime.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">Live Seat Locks:</strong> 5-minute reserved window prevents double bookings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CineBook Inc. Built with MERN Stack. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for Cinephiles</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
