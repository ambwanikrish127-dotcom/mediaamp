import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(returnTo, { replace: true });
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  const handleDemoLogin = async (asAdmin: boolean) => {
    const demoEmail = asAdmin ? 'admin@cinebook.com' : 'user@cinebook.com';
    const demoPassword = asAdmin ? 'Admin@123' : 'User@123';
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    const res = await login(demoEmail, demoPassword);
    setLoading(false);
    if (res.success) {
      if (asAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    } else {
      setError(res.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 mx-auto">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome to Cine<span className="text-rose-500">Book</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your digital QR tickets and faster checkout
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Accounts (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin(false)}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition group"
            >
              <div className="text-xs font-bold text-white group-hover:text-rose-400">
                Demo User
              </div>
              <div className="text-[10px] text-slate-400 font-mono">user@cinebook.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin(true)}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-left transition group"
            >
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Portal</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">admin@cinebook.com</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Account</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-400 hover:underline font-bold">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
