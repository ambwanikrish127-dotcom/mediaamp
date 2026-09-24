import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Film,
  MapPin,
  Search,
  User as UserIcon,
  LogOut,
  Ticket,
  ShieldCheck,
  Menu,
  X,
  Building2,
  ChevronDown,
  Check
} from 'lucide-react';
import { ICity } from '../types';

const POPULAR_CITIES = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, selectedCity, setSelectedCity } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [citiesList, setCitiesList] = useState<ICity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cityInputRef = useRef<HTMLInputElement>(null);

  // Fetch cities when modal opens or search changes
  useEffect(() => {
    if (showCityModal) {
      setLoadingCities(true);
      const query = citySearch.trim() ? `?search=${encodeURIComponent(citySearch.trim())}` : '';
      api.get(`/cities${query}`)
        .then(res => {
          if (res.data.success && Array.isArray(res.data.cities)) {
            setCitiesList(res.data.cities);
          }
        })
        .catch(err => {
          console.error('Error fetching cities:', err);
          // Fallback static list
          const staticCities: ICity[] = [
            { _id: '1', name: 'Jaipur', state: 'Rajasthan', country: 'India', slug: 'jaipur', isActive: true },
            { _id: '2', name: 'Delhi', state: 'Delhi NCR', country: 'India', slug: 'delhi', isActive: true },
            { _id: '3', name: 'Mumbai', state: 'Maharashtra', country: 'India', slug: 'mumbai', isActive: true },
            { _id: '4', name: 'Bangalore', state: 'Karnataka', country: 'India', slug: 'bangalore', isActive: true },
            { _id: '5', name: 'Hyderabad', state: 'Telangana', country: 'India', slug: 'hyderabad', isActive: true },
            { _id: '6', name: 'Pune', state: 'Maharashtra', country: 'India', slug: 'pune', isActive: true },
            { _id: '7', name: 'Chandigarh', state: 'Punjab', country: 'India', slug: 'chandigarh', isActive: true },
            { _id: '8', name: 'Kolkata', state: 'West Bengal', country: 'India', slug: 'kolkata', isActive: true },
            { _id: '9', name: 'Chennai', state: 'Tamil Nadu', country: 'India', slug: 'chennai', isActive: true },
            { _id: '10', name: 'Ahmedabad', state: 'Gujarat', country: 'India', slug: 'ahmedabad', isActive: true }
          ];
          if (citySearch.trim()) {
            const q = citySearch.toLowerCase();
            setCitiesList(staticCities.filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)));
          } else {
            setCitiesList(staticCities);
          }
        })
        .finally(() => setLoadingCities(false));
    }
  }, [showCityModal, citySearch]);

  // Focus city input when modal opens
  useEffect(() => {
    if (showCityModal) {
      setTimeout(() => cityInputRef.current?.focus(), 50);
    } else {
      setCitySearch('');
    }
  }, [showCityModal]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowCityModal(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                  Cine<span className="text-rose-500">Book</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                  Cinema Premiere
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies by title, genre, or director..."
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>
            </form>

            {/* Navigation Items & City Selector */}
            <div className="hidden md:flex items-center gap-4">
              {/* City Selector Button */}
              <button
                type="button"
                onClick={() => setShowCityModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-sm font-semibold hover:border-rose-500/50 hover:bg-slate-850 text-slate-200 transition group"
                title="Change Location"
              >
                <MapPin className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold">{selectedCity || 'Select City'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Links */}
              <Link
                to="/movies"
                className={`text-sm font-medium transition ${
                  location.pathname.startsWith('/movies') ? 'text-rose-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Movies
              </Link>

              <Link
                to="/theatres"
                className={`text-sm font-medium flex items-center gap-1.5 transition ${
                  location.pathname === '/theatres' ? 'text-rose-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Theatres</span>
              </Link>

              <Link
                to="/my-bookings"
                className={`text-sm font-medium flex items-center gap-1.5 transition ${
                  location.pathname === '/my-bookings' ? 'text-rose-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4 text-rose-500" />
                <span>My Bookings</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/20 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* User Profile / Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-rose-500/60 text-sm font-medium hover:bg-slate-850 transition shadow-sm"
                    title={`Logged in as ${user?.name}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-semibold text-slate-100 max-w-[130px] truncate">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-bookings"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                        >
                          <Ticket className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-slate-800 flex items-center gap-2 transition"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shadow-md shadow-rose-600/30"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Location & Hamburger */}
            <div className="flex items-center md:hidden gap-2">
              <button
                type="button"
                onClick={() => setShowCityModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-400"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{selectedCity}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200"
                />
              </div>
            </form>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/movies"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-sm font-medium"
              >
                All Movies
              </Link>
              <Link
                to="/theatres"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-sm font-medium flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                Theatres in {selectedCity}
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-sm font-medium flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-rose-500" />
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-400 text-sm font-medium flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-rose-600 text-white font-semibold text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Comprehensive Location Selector Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Select Your City</h3>
                  <p className="text-xs text-slate-400">Find movies and theatres near you</p>
                </div>
              </div>
              <button
                onClick={() => setShowCityModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 pb-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={cityInputRef}
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Search city (e.g. Jaipur, Delhi, Mumbai, Bangalore)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                />
                {citySearch && (
                  <button
                    onClick={() => setCitySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Popular Cities */}
            <div className="px-6 py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Cities
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      selectedCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {city}
                    {selectedCity.toLowerCase() === city.toLowerCase() && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Cities Search Result List */}
            <div className="px-6 py-3 max-h-60 overflow-y-auto divide-y divide-slate-800/60">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                {citySearch ? `Matching Cities (${citiesList.length})` : 'All Available Cities'}
              </span>

              {loadingCities ? (
                <div className="py-6 text-center text-sm text-slate-500">Loading cities...</div>
              ) : citiesList.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  No cities found matching "{citySearch}".
                </div>
              ) : (
                citiesList.map((c) => {
                  const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c._id || c.name}
                      onClick={() => handleCitySelect(c.name)}
                      className={`w-full py-2.5 px-2 flex items-center justify-between text-left hover:bg-slate-850 rounded-lg transition ${
                        isSelected ? 'text-rose-400 font-bold bg-rose-500/10' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.state}, {c.country || 'India'}</p>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs text-rose-400 font-semibold">
                          <Check className="w-4 h-4" />
                          <span>Selected</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 hover:text-slate-300">Select →</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Current: <strong className="text-rose-400">📍 {selectedCity}</strong></span>
              <button
                onClick={() => setShowCityModal(false)}
                className="text-xs text-slate-300 hover:text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
