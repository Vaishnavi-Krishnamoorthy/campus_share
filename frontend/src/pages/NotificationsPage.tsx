import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api.js';
import { Notification } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Inbox,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markRead(id);
      await fetchNotifications();
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      await fetchNotifications();
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return <CheckCircle className="size-5 text-emerald-600" />;
      case 'OVERDUE':
        return <AlertTriangle className="size-5 text-rose-600" />;
      case 'DUE_SOON':
        return <Clock className="size-5 text-amber-600" />;
      case 'REQUEST_RECEIVED':
        return <Bell className="size-5 text-indigo-600" />;
      default:
        return <Sparkles className="size-5 text-indigo-500" />;
    }
  };

  const list = notifications || [];
  const filteredList = filter === 'UNREAD' ? list.filter((n) => !n.is_read) : list;
  const unreadCount = list.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 mb-2">
            <Bell className="size-3 text-indigo-600" />
            Activity Alerts
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Student Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates about your borrow requests, approval transactions, and due dates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs shrink-0 self-start sm:self-auto"
          >
            <CheckCheck className="size-4 text-indigo-600" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({list.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'UNREAD'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="min-w-[18px] h-4.5 px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-black leading-none">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-14 text-center shadow-xs">
          <Inbox className="size-12 text-slate-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-800 font-display">No notifications</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {filter === 'UNREAD'
              ? "You've read all your activity alerts! Check back later."
              : 'You have no campus notifications right now.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((notif) => (
            <div
              key={notif.notification_id}
              className={`flex items-start justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                notif.is_read
                  ? 'border-slate-200/70 bg-white'
                  : 'border-indigo-200/90 bg-indigo-50/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 place-items-center rounded-xl bg-white border border-slate-200/80 shrink-0 shadow-xs">
                  {getIcon(notif.type)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.is_read && (
                      <span className="size-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold text-slate-400">
                    {new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkRead(notif.notification_id)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition shrink-0 shadow-xs"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
