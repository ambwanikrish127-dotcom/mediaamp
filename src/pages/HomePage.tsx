import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MovieService, TheatreService } from '../services/api';
import { IMovie, ITheatre } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Clock,
  ChevronRight,
  Film,
  Sparkles,
  MapPin,
  Flame,
  Search,
  Ticket
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { selectedCity } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [theatres, setTheatres] = useState<ITheatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    MovieService.getMovies()
      .then((movieRes) => {
        if (movieRes.success) setMovies(movieRes.movies);
      })
      .catch((err) => console.error('Error fetching movies:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    TheatreService.getTheatres({ city: selectedCity })
      .then((theatreRes) => {
        if (theatreRes.success && Array.isArray(theatreRes.theatres)) {
          setTheatres(theatreRes.theatres);
        }
      })
      .catch((err) => console.error('Error fetching theatres for city:', err));
  }, [selectedCity]);

  const nowShowing = movies.filter(m => m.status === 'NOW_SHOWING');
  const comingSoon = movies.filter(m => m.status === 'COMING_SOON');
  const featured = nowShowing[0] || movies[0];

  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Animation'];

  const filteredNowShowing = activeGenre === 'All'
    ? nowShowing
    : nowShowing.filter(m => m.genre.includes(activeGenre));

  const displayTheatres = theatres;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 pb-20">
      {/* Hero Blockbuster Banner */}
      {featured && (
        <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden">
          {/* Background backdrop with cinematic overlay */}
          <div className="absolute inset-0">
            <img
              src={featured.banner}
              alt={featured.title}
              className="w-full h-full object-cover object-center filter brightness-60 scale-105 transition duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Blockbuster Premiere in {selectedCity}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                {featured.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{featured.rating.toFixed(1)}/10</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-semibold">
                  {featured.certification}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.duration}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-rose-400 font-semibold">{featured.language}</span>
                <span className="text-slate-400">•</span>
                <span>{featured.genre.join(', ')}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
                {featured.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={`/movies/${featured._id}`}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Tickets Now</span>
                </Link>

                <Link
                  to={`/movies/${featured._id}`}
                  className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base backdrop-blur-md transition"
                >
                  View Showtimes & Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Search & City Bar for Mobile/Tablet */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-lg flex flex-col sm:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title, genre, or director..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Showing cinemas in:</span>
            <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              {selectedCity}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-16">
        {/* Now Showing Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Now Showing</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  {filteredNowShowing.length} Movies
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a movie to pick your favorite theatre and preferred showtime
              </p>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeGenre === genre
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-900 rounded-2xl h-80 border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredNowShowing.map((movie) => (
                <div
                  key={movie._id}
                  className="group relative bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-600/10 transition-all flex flex-col"
                >
                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Rating Pill */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-400 border border-slate-700/60">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>

                    {/* Format / Cert */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-300 border border-slate-700/60">
                      {movie.certification}
                    </div>

                    {/* Language Badge */}
                    <div className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600/90 text-white">
                      {movie.language}
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {movie.genre.join(', ')}
                      </p>
                    </div>

                    <Link
                      to={`/movies/${movie._id}`}
                      className="w-full py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold text-center transition flex items-center justify-center gap-1 group-hover:bg-rose-600 group-hover:text-white"
                    >
                      <span>Book Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Coming Soon to Cinemas</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upcoming cinematic spectacles scheduled for theatrical release
                </p>
              </div>

              <Link
                to="/movies?status=COMING_SOON"
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {comingSoon.map((movie) => (
                <div
                  key={movie._id}
                  className="group bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      Releasing {movie.releaseDate}
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{movie.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{movie.genre.join(', ')}</p>
                    </div>

                    <div className="mt-3">
                      <span className="block w-full text-center py-1.5 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-semibold">
                        Releasing Soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Theatres Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-rose-500" />
                <span>Theatres in {selectedCity}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Premium multi-format cinema auditoriums equipped with IMAX & Dolby Atmos
              </p>
            </div>
            <Link
              to="/theatres"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <span>Explore All Theatres</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayTheatres.map((theatre) => (
              <div
                key={theatre._id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{theatre.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{theatre.location}, {theatre.city}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-rose-400 border border-slate-700 shrink-0">
                    {theatre.totalScreens} Screens
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                    IMAX Laser
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    Dolby Atmos
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                    F&B Concessions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights Banner */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/30 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h4 className="text-base font-bold text-white">Zero Double-Booking Guarantee</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seats are immediately locked atomically for 5 minutes during checkout to ensure you never lose your selected spot.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
              🍿
            </div>
            <h4 className="text-base font-bold text-white">Gourmet Snacks to Seat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-order caramel popcorn, ice-cold beverages, and loaded nachos directly with your tickets at concession pricing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              📱
            </div>
            <h4 className="text-base font-bold text-white">Instant Contactless QR Pass</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive your high-resolution QR ticket right after checkout. Walk into the theater with zero paper ticket lines.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
