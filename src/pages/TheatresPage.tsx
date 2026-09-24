import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TheatreService } from '../services/api';
import { ITheatre } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  Search,
  Sparkles,
  Film,
  AlertCircle,
  RefreshCw,
  Tv,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const TheatresPage: React.FC = () => {
  const { selectedCity } = useAuth();
  const [theatres, setTheatres] = useState<ITheatre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTheatres = () => {
    setLoading(true);
    setError(null);
    TheatreService.getTheatres({
      city: selectedCity,
      search: searchQuery.trim() || undefined
    })
      .then((res) => {
        if (res.success && Array.isArray(res.theatres)) {
          setTheatres(res.theatres);
        } else {
          setError(res.message || 'Failed to retrieve theatres from database.');
        }
      })
      .catch((err) => {
        console.error('Error fetching theatres from API:', err);
        setError(err.response?.data?.message || err.message || 'Failed to connect to Theatre API service.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTheatres();
  }, [selectedCity, searchQuery]);

  return (
    <div className="min-h-screen text-slate-100 pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900/60 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multiplex & Cinema Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Theatres in <span className="text-rose-500">{selectedCity}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Discover certified cinema halls, IMAX laser auditoriums, and heritage single-screens with real-time show schedules.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cinema name or area..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 animate-pulse"
              >
                <div className="h-40 bg-slate-800 rounded-xl" />
                <div className="h-5 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-red-950/20 border border-red-800/40 text-center max-w-xl mx-auto space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Failed to Load Theatres</h3>
              <p className="text-sm text-slate-400 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchTheatres}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && theatres.length === 0 && (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Theatres Found</h3>
              <p className="text-sm text-slate-400 mt-1">
                {searchQuery
                  ? `No cinema halls found matching "${searchQuery}" in ${selectedCity}.`
                  : `Currently no active theatres registered in ${selectedCity}. Try selecting Jaipur, Delhi, or Mumbai.`}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 transition"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        {/* Theatre Cards Grid */}
        {!loading && !error && theatres.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theatres.map((theatre) => {
              const bgImg =
                theatre.images && theatre.images.length > 0
                  ? theatre.images[0]
                  : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={theatre._id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg"
                >
                  {/* Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={bgImg}
                      alt={theatre.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-rose-400 flex items-center gap-1">
                      <Tv className="w-3 h-3" />
                      <span>{theatre.totalScreens || 2} Screens</span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        📍 {theatre.city}
                      </span>
                      <h3 className="text-xl font-black text-white mt-1 drop-shadow-md truncate">
                        {theatre.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <p className="text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{theatre.address || theatre.location || `${theatre.name}, ${theatre.city}`}</span>
                      </p>

                      {/* Amenities & Facilities */}
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                          Highlights & Formats
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(theatre.facilities || ['Dolby Atmos', '4K Projection', 'Recliners']).map((fac, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{fac}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <Link
                        to="/movies"
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>View Movies & Showtimes</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
