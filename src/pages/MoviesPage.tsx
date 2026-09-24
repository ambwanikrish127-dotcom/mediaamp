import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MovieService } from '../services/api';
import { IMovie } from '../types';
import { Search, Star, Clock, ChevronRight, Film } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'ALL';

  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);

  useEffect(() => {
    MovieService.getMovies()
      .then(res => {
        if (res.success) setMovies(res.movies);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const genres = ['ALL', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Animation', 'Biography', 'Crime', 'Fantasy'];
  const languages = ['ALL', 'English', 'Hindi'];

  const filteredMovies = movies.filter(movie => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchGenre = movie.genre.some(g => g.toLowerCase().includes(q));
      const matchDirector = movie.director.toLowerCase().includes(q);
      if (!matchTitle && !matchGenre && !matchDirector) return false;
    }

    // Genre
    if (selectedGenre !== 'ALL') {
      if (!movie.genre.includes(selectedGenre)) return false;
    }

    // Language
    if (selectedLanguage !== 'ALL') {
      if (movie.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    }

    // Status
    if (selectedStatus !== 'ALL') {
      if (movie.status !== selectedStatus) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Film className="w-8 h-8 text-rose-500" />
          <span>Explore Cinema Catalog</span>
        </h1>
        <p className="text-sm text-slate-400">
          Browse through the latest blockbuster releases, IMAX spectacles, and upcoming premiere shows.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movie title, genre, or director..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto shrink-0">
            {['ALL', 'NOW_SHOWING', 'COMING_SOON'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All Movies' : status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Filters: Genre & Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          {/* Genre chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-500 font-semibold uppercase tracking-wider mr-1 shrink-0">
              Genre:
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedGenre === genre
                    ? 'bg-slate-800 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">Language:</span>
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedLanguage === lang
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-900 rounded-2xl h-80 border border-slate-800" />
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No movies found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms, genre or language filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedGenre('ALL');
              setSelectedLanguage('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-rose-400 hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className="group bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-600/10 transition-all flex flex-col"
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

                {/* Rating */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-400 border border-slate-700/60">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>

                {/* Status pill */}
                <div className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-700">
                  {movie.language} • {movie.certification}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {movie.genre.join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{movie.duration}</span>
                  </p>
                </div>

                <Link
                  to={`/movies/${movie._id}`}
                  className="w-full py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold text-center transition flex items-center justify-center gap-1 group-hover:bg-rose-600 group-hover:text-white"
                >
                  <span>{movie.status === 'COMING_SOON' ? 'View Details' : 'Book Tickets'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
