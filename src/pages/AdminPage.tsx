import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AdminService,
  MovieService,
  TheatreService,
  ShowService
} from '../services/api';
import { IAdminStats, IMovie, ITheatre, IBooking } from '../types';
import {
  ShieldCheck,
  Film,
  Tv,
  Calendar,
  DollarSign,
  Ticket,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  MapPin
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [theatres, setTheatres] = useState<ITheatre[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MOVIES' | 'THEATRES' | 'SHOWS' | 'BOOKINGS'>('OVERVIEW');

  // Modals
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [showAddShowModal, setShowAddShowModal] = useState(false);

  // Form states
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    poster: '',
    banner: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    rating: 8.5,
    duration: '2h 15m',
    certification: 'UA 16+',
    releaseDate: '2025-05-15',
    director: '',
    cast: 'Actor 1, Actor 2',
    status: 'NOW_SHOWING'
  });

  const [newTheatre, setNewTheatre] = useState({
    name: '',
    city: 'Mumbai',
    location: '',
    screensCount: 2
  });

  const [newShow, setNewShow] = useState({
    movieId: '',
    theatreId: '',
    screenId: 'screen_1',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    priceRegular: 220,
    pricePremium: 340,
    priceRecliner: 520
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, bookingsRes] = await Promise.all([
        AdminService.getStats(),
        MovieService.getMovies(),
        TheatreService.getTheatres(),
        AdminService.getAllBookings()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (moviesRes.success) {
        setMovies(moviesRes.movies);
        if (moviesRes.movies.length > 0 && !newShow.movieId) {
          setNewShow(prev => ({ ...prev, movieId: moviesRes.movies[0]._id }));
        }
      }
      if (theatresRes.success) {
        setTheatres(theatresRes.theatres);
        if (theatresRes.theatres.length > 0 && !newShow.theatreId) {
          setNewShow(prev => ({ ...prev, theatreId: theatresRes.theatres[0]._id }));
        }
      }
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
    } catch (err: any) {
      console.error('Admin loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      // Allow viewing or redirect
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  // Handle Add Movie
  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMovie,
        genre: newMovie.genre.split(',').map(s => s.trim()),
        cast: newMovie.cast.split(',').map(s => s.trim())
      };
      const res = await MovieService.createMovie(payload);
      if (res.success) {
        setFeedback({ type: 'success', text: `Movie "${res.movie.title}" added to catalog successfully!` });
        setShowAddMovieModal(false);
        loadAdminData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to add movie.' });
    }
  };

  // Handle Add Theatre
  const handleCreateTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await TheatreService.createTheatre(newTheatre);
      if (res.success) {
        setFeedback({ type: 'success', text: `Theatre "${res.theatre.name}" created successfully with default auditoriums!` });
        setShowAddTheatreModal(false);
        loadAdminData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to add theatre.' });
    }
  };

  // Handle Add Show
  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        movieId: newShow.movieId,
        theatreId: newShow.theatreId,
        screenId: newShow.screenId,
        date: newShow.date,
        time: newShow.time,
        prices: {
          Regular: Number(newShow.priceRegular),
          Premium: Number(newShow.pricePremium),
          Recliner: Number(newShow.priceRecliner)
        }
      };
      const res = await ShowService.createShow(payload);
      if (res.success) {
        setFeedback({ type: 'success', text: `Show session scheduled for ${res.show.time} successfully!` });
        setShowAddShowModal(false);
        loadAdminData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to schedule show.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cinema Operations Console</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Admin Management Portal
          </h1>
          <p className="text-xs text-slate-400">
            Control movies, auditoriums, showtimes, customer tickets, and financial metrics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddMovieModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-rose-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Movie</span>
          </button>

          <button
            onClick={() => setShowAddTheatreModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Theatre</span>
          </button>

          <button
            onClick={() => setShowAddShowModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Show</span>
          </button>
        </div>
      </div>

      {/* Feedback alerts */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs flex items-center justify-between gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
              : 'bg-red-950/60 border-red-800/80 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Revenue</span>
          </span>
          <div className="text-2xl font-black text-white font-mono">
            ₹{stats?.totalRevenue || 0}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-rose-500" />
            <span>Total Bookings</span>
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalBookings || 0}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Movies</span>
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalMovies || movies.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>Theatres</span>
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalTheatres || theatres.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Shows</span>
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalShows || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'OVERVIEW', label: 'All Bookings' },
          { id: 'MOVIES', label: `Manage Movies (${movies.length})` },
          { id: 'THEATRES', label: `Theatres (${theatres.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: All Bookings */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Customer Bookings & Transactions ({bookings.length})
            </h3>
            <button
              onClick={loadAdminData}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Refresh Data
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
              No customer bookings recorded yet. Once users complete checkout, tickets appear here live.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Movie</th>
                    <th className="p-3.5">Show Date & Time</th>
                    <th className="p-3.5">Seats</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-rose-400">{b.bookingId}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{b.userName}</div>
                        <div className="text-[10px] text-slate-400">{b.userEmail}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">{b.movieTitle}</td>
                      <td className="p-3.5 text-slate-300">
                        {b.showDate} • {b.showTime}
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                          {b.seats.map(s => s.seatNumber).join(', ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">₹{b.totalAmount}</td>
                      <td className="p-3.5">
                        {b.bookingStatus === 'CANCELLED' ? (
                          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] font-bold text-red-400 uppercase">
                            CANCELLED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] font-bold text-emerald-400 uppercase">
                            CONFIRMED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Movies */}
      {activeTab === 'MOVIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Catalog Movies</h3>
            <button
              onClick={() => setShowAddMovieModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              + Add New Movie
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movies.map(m => (
              <div
                key={m._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3"
              >
                <img src={m.poster} alt={m.title} className="w-16 h-24 object-cover rounded-lg shrink-0" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white text-sm">{m.title}</h4>
                  <p className="text-slate-400">{m.language} • {m.certification}</p>
                  <p className="text-slate-400">{m.genre.join(', ')}</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] font-bold">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Theatres */}
      {activeTab === 'THEATRES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Cinema Auditoriums</h3>
            <button
              onClick={() => setShowAddTheatreModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              + Add Theatre
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {theatres.map(t => (
              <div
                key={t._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-rose-400 text-[10px] font-bold">
                    {t.city}
                  </span>
                </div>
                <p className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{t.location}</span>
                </p>
                <p className="text-slate-500 font-mono text-[10px]">
                  Screens: {t.totalScreens} • IMAX / Dolby Atmos
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Movie */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Movie to CineBook</h3>
              <button onClick={() => setShowAddMovieModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. Gladiator II"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Synopsis</label>
                <textarea
                  rows={2}
                  required
                  value={newMovie.description}
                  onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="Brief synopsis..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Language</label>
                  <input
                    type="text"
                    value={newMovie.language}
                    onChange={e => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Certification</label>
                  <input
                    type="text"
                    value={newMovie.certification}
                    onChange={e => setNewMovie({ ...newMovie, certification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMovie.duration}
                    onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rating (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={e => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Director</label>
                <input
                  type="text"
                  value={newMovie.director}
                  onChange={e => setNewMovie({ ...newMovie, director: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Genres (comma separated)</label>
                <input
                  type="text"
                  value={newMovie.genre}
                  onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={newMovie.poster}
                  onChange={e => setNewMovie({ ...newMovie, poster: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Theatre */}
      {showAddTheatreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Cinema Theatre</h3>
              <button onClick={() => setShowAddTheatreModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTheatre} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Theatre Name</label>
                <input
                  type="text"
                  required
                  value={newTheatre.name}
                  onChange={e => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  placeholder="e.g. CineBook Premiere IMAX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City</label>
                <select
                  value={newTheatre.city}
                  onChange={e => setNewTheatre({ ...newTheatre, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mall / Locality</label>
                <input
                  type="text"
                  required
                  value={newTheatre.location}
                  onChange={e => setNewTheatre({ ...newTheatre, location: e.target.value })}
                  placeholder="e.g. Phoenix Palladium, Lower Parel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTheatreModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Create Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Show */}
      {showAddShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Schedule Movie Show</h3>
              <button onClick={() => setShowAddShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShow} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Movie</label>
                <select
                  value={newShow.movieId}
                  onChange={e => setNewShow({ ...newShow, movieId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {movies.map(m => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Theatre</label>
                <select
                  value={newShow.theatreId}
                  onChange={e => setNewShow({ ...newShow, theatreId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {theatres.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newShow.date}
                    onChange={e => setNewShow({ ...newShow, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Show Time</label>
                  <input
                    type="text"
                    value={newShow.time}
                    onChange={e => setNewShow({ ...newShow, time: e.target.value })}
                    placeholder="e.g. 07:30 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Regular (₹)</label>
                  <input
                    type="number"
                    value={newShow.priceRegular}
                    onChange={e => setNewShow({ ...newShow, priceRegular: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Premium (₹)</label>
                  <input
                    type="number"
                    value={newShow.pricePremium}
                    onChange={e => setNewShow({ ...newShow, pricePremium: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recliner (₹)</label>
                  <input
                    type="number"
                    value={newShow.priceRecliner}
                    onChange={e => setNewShow({ ...newShow, priceRecliner: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
