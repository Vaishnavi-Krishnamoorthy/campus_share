import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { dashboardService } from '../services/api.js';
import { DashboardStats, RecentActivityItem } from '../types/index.js';
import { getDefaultAvatar } from '../utils/avatars.js';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Inbox,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data.success) {
          setStats(res.data.stats || res.data.data || null);
          setActivity(res.data.recentActivity || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-10 w-48 bg-slate-200 rounded-2xl animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-slide-up">
        <div className="flex items-center gap-4">
          <img
            src={user?.profile_image || getDefaultAvatar(user?.name)}
            alt={user?.name}
            className="size-16 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              <UserCheck className="size-3 text-indigo-600" />
              Verified Student Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.department} • Year {user?.year || 3} • ID: {user?.student_number}
            </p>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/add-resource"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
          >
            <PlusCircle className="size-4" />
            List Resource
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Search className="size-4 text-indigo-600" />
            Browse Catalog
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition"
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* OVERDUE ALERT BANNER */}
      {(stats?.overdueItems || 0) > 0 && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-rose-50 border border-rose-200 p-5 text-rose-800 shadow-sm animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 place-items-center rounded-2xl bg-rose-600 text-white shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">You have {stats?.overdueItems} overdue resource loan!</h4>
              <p className="text-xs text-rose-600 mt-0.5">
                Please return it to the student owner on campus to maintain a high campus trust rating.
              </p>
            </div>
          </div>
          <Link
            to="/borrowed"
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs self-start sm:self-auto shrink-0"
          >
            View Overdue Loan →
          </Link>
        </div>
      )}

      {/* 1. METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        {/* Card 1: Currently Borrowed */}
        <Link
          to="/borrowed"
          className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110">
              <Package className="size-6" />
            </span>
            <ArrowUpRight className="size-4 text-slate-300 group-hover:text-indigo-600 transition" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-4">
            {stats?.currentlyBorrowed || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">Currently Borrowed Items</p>
        </Link>

        {/* Card 2: Pending Requests */}
        <Link
          to="/lending-requests"
          className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:scale-110">
              <Clock className="size-6" />
            </span>
            <ArrowUpRight className="size-4 text-slate-300 group-hover:text-amber-600 transition" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-4">
            {stats?.pendingRequests || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Pending Requests ({stats?.pendingReceivedCount || 0} incoming)
          </p>
        </Link>

        {/* Card 3: Items Lent */}
        <Link
          to="/borrowed"
          className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
              <CheckCircle2 className="size-6" />
            </span>
            <ArrowUpRight className="size-4 text-slate-300 group-hover:text-emerald-600 transition" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-4">
            {stats?.itemsLent || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">Total Items Lent to Classmates</p>
        </Link>

        {/* Card 4: My Listed Resources */}
        <Link
          to="/my-resources"
          className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-purple-50 text-purple-600 transition group-hover:scale-110">
              <Layers className="size-6" />
            </span>
            <ArrowUpRight className="size-4 text-slate-300 group-hover:text-purple-600 transition" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-4">
            {stats?.myListings || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">My Active Resource Listings</p>
        </Link>

      </div>

      {/* 2. RECENT ACTIVITY & QUICK SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Timeline (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">Recent Campus Activity</h3>
              <p className="text-xs text-slate-500">Your recent borrow requests and resource loans</p>
            </div>
            <Link to="/borrowed" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All Loans →
            </Link>
          </div>

          {activity.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <Inbox className="size-12 mx-auto mb-3 stroke-1 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">No recent borrowing activity yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Explore the catalog to request your first campus item.</p>
              <Link to="/browse" className="text-xs font-bold text-indigo-600 mt-3 inline-block">
                Start Browsing Items →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 transition hover:bg-slate-100/70"
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-xl text-[11px] font-extrabold ${
                      item.activity_type === 'BORROWING' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.activity_type === 'BORROWING' ? 'LOAN' : 'REQ'}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(item.activity_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    item.status_badge === 'APPROVED' || item.status_badge === 'RETURNED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status_badge === 'ACTIVE'
                      ? 'bg-indigo-100 text-indigo-700'
                      : item.status_badge === 'OVERDUE'
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status_badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Hub / Guides (1 col) */}
        <div className="space-y-5">
          
          {/* Incoming Lending Requests Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-1 font-display">Incoming Lending Requests</h4>
            <p className="text-xs text-slate-500 mb-4">
              Students wanting to borrow resources you listed.
            </p>
            <Link
              to="/lending-requests"
              className="flex w-full items-center justify-between rounded-2xl bg-indigo-50/80 border border-indigo-100 p-3.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
            >
              <span>Manage Incoming ({stats?.pendingReceivedCount || 0})</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          {/* Quick List Resource Prompt */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-xl shadow-indigo-500/15">
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md mb-2">
              Share With Juniors
            </span>
            <h4 className="text-base font-bold font-display">Got Spares in Your Dorm?</h4>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              List calculators, reference books, or engineering tools you don't need right now and help classmates.
            </p>
            <Link
              to="/add-resource"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-50 transition shadow-sm"
            >
              <PlusCircle className="size-3.5" />
              List Resource Now
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
