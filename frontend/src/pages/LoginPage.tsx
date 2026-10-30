import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Share2, Lock, Mail, AlertCircle, ArrowRight, Sparkles, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('student@campusshare.edu');
    setPassword('Password123!');
  };

  const [showAdminUnlock, setShowAdminUnlock] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminKeyError, setAdminKeyError] = useState(false);

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Only the user knows the admin secret key
    if (adminKey === 'admin2026' || adminKey === 'Password123!') {
      setEmail('admin@campusshare.edu');
      setPassword('Password123!');
      setShowAdminUnlock(false);
      setAdminKeyError(false);
    } else {
      setAdminKeyError(true);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 font-display text-2xl font-extrabold text-slate-900 group">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Share2 className="size-6" />
            </span>
            <span>
              Campus<span className="text-gradient">Share</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 font-display">
            Student Account Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your campus listings, manage borrow requests, and review loans.
          </p>
        </div>

        {/* Login Form Container */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-xl shadow-indigo-500/5">
          
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-700">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="size-3.5 text-indigo-600" />
                Campus Email Address
              </label>
              <input
                type="email"
                required
                placeholder="your.name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="size-3.5 text-indigo-600" />
                  Password
                </span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In to CampusShare
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-2.5 text-xs font-bold text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
            >
              <User className="size-3.5 text-indigo-600" />
              Try Demo Student Account
            </button>
          </div>

          {/* Secure Private Admin Portal Toggle */}
          <div className="mt-4 pt-3 text-center border-t border-slate-100 dark:border-slate-800">
            {!showAdminUnlock ? (
              <button
                type="button"
                onClick={() => setShowAdminUnlock(true)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold transition inline-flex items-center gap-1"
              >
                <ShieldCheck className="size-3" />
                Private Admin Access
              </button>
            ) : (
              <form onSubmit={handleAdminUnlock} className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-scale-up text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <ShieldCheck className="size-3 text-amber-500" />
                    Enter Admin Security Passcode
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminUnlock(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter admin passcode"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {adminKeyError && (
                  <p className="text-[10px] text-rose-500 font-medium">Incorrect security passcode.</p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 transition"
                >
                  Unlock Admin Credentials
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have a campus account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};
