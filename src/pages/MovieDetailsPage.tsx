import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MovieService, ShowService, TheatreService } from '../services/api';
import { IMovie, IShow, ITheatre } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
  Ticket,
  ChevronLeft,
  Tv
} from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCity } = useAuth();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [shows, setShows] = useState<IShow[]>([]);
  const [theatres, setTheatres] = useState<ITheatre[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate next 5 dates for date selector
  const availableDates: { label: string; dateStr: string; dayName: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    availableDates.push({ label, dateStr, dayName });
  }

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].dateStr);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      MovieService.getMovieById(id),
      ShowService.getShows({ movieId: id }),
      TheatreService.getTheatres()
    ])
      .then(([movieRes, showRes, theatreRes]) => {
        if (movieRes.success) setMovie(movieRes.movie);
        if (showRes.success) setShows(showRes.shows);
        if (theatreRes.success) setTheatres(theatreRes.theatres);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading movie premiere details and auditoriums...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-100">
        <h2 className="text-2xl font-bold">Movie not found</h2>
        <Link to="/movies" className="mt-4 inline-block px-4 py-2 bg-rose-600 rounded-lg text-sm">
          Return to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date
  const filteredShows = shows.filter(s => s.date === selectedDate);

  // Group shows by Theatre
  const showsByTheatre: { [theatreId: string]: IShow[] } = {};
  filteredShows.forEach(s => {
    if (!showsByTheatre[s.theatreId]) {
      showsByTheatre[s.theatreId] = [];
    }
    showsByTheatre[s.theatreId].push(s);
  });

  return (
    <div className="min-h-screen text-slate-100 pb-20">
      {/* Banner Backdrop */}
      <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
        <img
          src={movie.banner || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            to="/movies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Backdrop Content */}
        <div className="absolute bottom-6 max-w-7xl mx-auto left-0 right-0 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Poster Thumb */}
          <div className="w-28 sm:w-40 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-900 shrink-0 hidden sm:block">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-xs uppercase">
                {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs">
                {movie.certification}
              </span>
              <span className="text-xs text-rose-400 font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/40">
                {movie.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{movie.duration}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-200">{movie.genre.join(' • ')}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Release: {movie.releaseDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Theatres and Showtimes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Date Picker Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>Select Screening Date</span>
              </span>
              <span className="text-slate-500">City: {selectedCity}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableDates.map(item => (
                <button
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`flex flex-col items-center min-w-[80px] py-2 px-3 rounded-xl transition ${
                    selectedDate === item.dateStr
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold scale-105'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-semibold uppercase">{item.dayName}</span>
                  <span className="text-sm font-extrabold mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theatres & Shows List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-rose-500" />
                <span>Available Theatres & Showtimes</span>
              </h2>
              <span className="text-xs text-slate-400">
                Click any showtime to select seats
              </span>
            </div>

            {Object.keys(showsByTheatre).length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No shows scheduled for {selectedDate}</h4>
                <p className="text-xs text-slate-500">
                  Please pick another date from the calendar selector above.
                </p>
              </div>
            ) : (
              Object.entries(showsByTheatre).map(([theatreId, theatreShows]) => {
                const theatre = theatres.find(t => t._id === theatreId);
                const theatreName = theatre?.name || theatreShows[0].theatreName || 'CineBook Multiplex';
                const theatreLocation = theatre?.location || theatreShows[0].theatreLocation || 'Auditorium Complex';

                return (
                  <div
                    key={theatreId}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{theatreName}</span>
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{theatreLocation}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800 text-[11px] font-semibold">
                          M-Ticket Available
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800 text-[11px] font-semibold">
                          F&B Concessions
                        </span>
                      </div>
                    </div>

                    {/* Showtimes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                      {theatreShows.map(show => (
                        <Link
                          key={show._id}
                          to={`/shows/${show._id}/seats`}
                          className="group p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 hover:bg-rose-950/20 transition flex flex-col items-center text-center space-y-1"
                        >
                          <span className="text-sm font-extrabold text-emerald-400 group-hover:text-rose-400 transition">
                            {show.time}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {show.screenType || 'Dolby Atmos'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            From ₹{show.prices?.Regular || 220}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Movie Details, Cast & Director */}
        <div className="space-y-6">
          {/* About Synopsis */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Movie Synopsis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {movie.description}
            </p>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
                  Director
                </span>
                <span className="text-white font-bold text-sm">{movie.director}</span>
              </div>

              <div>
                <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">
                  Starring Cast
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.cast.map(c => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Cancellation Policy Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span>🎟️ CineBook Assurance</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Free cancellation is supported up to 30 minutes before showtime. 100% refund is initiated directly upon eligible cancellation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
