import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useTheme, ThemeMode } from '../context/ThemeContext.js';
import { useChat } from '../context/ChatContext.js';
import { getDefaultAvatar } from '../utils/avatars.js';
import {
  Share2,
  Bell,
  PlusCircle,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Package,
  Clock,
  ArrowRight,
  Compass,
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Sun,
  Moon,
  Sparkles,
  Palette
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, unreadNotifications, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { unreadTotal, openChat } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const themes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'light', label: 'Light Campus', icon: '☀️' },
    { id: 'dark', label: 'Dark Mode', icon: '🌙' },
    { id: 'emerald', label: 'Emerald Forest', icon: '🌿' },
    { id: 'cyberpunk', label: 'Cyberpunk Glow', icon: '💜' }
  ];

  const userAvatar = user?.profile_image || getDefaultAvatar(user?.name);

  return (
    <header className="glass-nav sticky top-0 z-40 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group"
        >
          <span className="grid size-9.5 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/30">
            <Share2 className="size-5" />
          </span>
          <span className="flex items-center tracking-tight">
            Campus<span className="text-gradient font-black ml-0.5">Share</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isActive('/')
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isActive('/browse')
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Compass className="size-3.5" />
            Catalog
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive('/dashboard')
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <LayoutDashboard className="size-3.5" />
                Dashboard
              </Link>
              <Link
                to="/borrowed"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive('/borrowed')
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                My Loans
              </Link>
              <Link
                to="/lending-requests"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive('/lending-requests')
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Requests
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                isActive('/admin')
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <ShieldCheck className="size-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right User Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          
          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="grid size-9.5 place-items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
              title="Change Theme"
            >
              {theme === 'dark' ? <Moon className="size-4 text-indigo-400" /> : <Sun className="size-4 text-amber-500" />}
            </button>

            {themeMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl z-50 animate-scale-up"
                onClick={() => setThemeMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Select Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                      theme === t.id
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </span>
                    {theme === t.id && <span className="size-1.5 rounded-full bg-indigo-600"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {/* Chat Icon Button */}
              <button
                onClick={() => openChat(101, 'Ananya S.', undefined, 'Casio FX-991EX ClassWiz Calculator')}
                className="relative grid size-9.5 place-items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition shadow-xs"
                title="Campus Chat"
              >
                <MessageSquare className="size-4" />
                {unreadTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-md ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadTotal}
                  </span>
                )}
              </button>

              {/* Notification Icon with Un-cramped Pill Badge */}
              <Link
                to="/notifications"
                className="relative grid size-9.5 place-items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition shadow-xs"
                title="Notifications"
              >
                <Bell className="size-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-md ring-2 ring-white dark:ring-slate-900 leading-none">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              {/* List Resource CTA */}
              <Link
                to="/add-resource"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-500/30 transition-all duration-200"
              >
                <PlusCircle className="size-4" />
                List Resource
              </Link>

              {/* User Dropdown with Cute Character Avatar */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 p-1 pr-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
                >
                  <img
                    src={userAvatar}
                    alt={user?.name}
                    className="size-7.5 rounded-full object-cover border border-indigo-200 dark:border-indigo-800 bg-indigo-50"
                  />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{user?.department?.split(' ')[0] || 'Student'}</p>
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-2xl z-50 animate-scale-up"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="border-b border-slate-100 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2.5">
                      <img src={userAvatar} alt="avatar" className="size-9 rounded-full border border-slate-200" />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition"
                      >
                        <UserIcon className="size-4 text-slate-400" />
                        My Profile & Cute Avatar
                      </Link>
                      <Link
                        to="/my-resources"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition"
                      >
                        <Package className="size-4 text-slate-400" />
                        My Listed Gear
                      </Link>
                      <Link
                        to="/my-requests"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition"
                      >
                        <Clock className="size-4 text-slate-400" />
                        Sent Requests
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition"
              >
                Join Campus
              </Link>
            </>
          )}

        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 space-y-3 backdrop-blur-xl animate-fade-in">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-700 dark:text-slate-200"
          >
            Explore Catalog
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/add-resource"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-indigo-600"
              >
                + List a Resource
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-sm font-bold text-rose-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}

    </header>
  );
};
