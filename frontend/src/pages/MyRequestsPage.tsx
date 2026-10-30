import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api.js';
import { BorrowRequest } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useChat } from '../context/ChatContext.js';
import { Clock, Calendar, XCircle, ArrowRight, MapPin, AlertCircle, MessageSquare } from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const { openChat } = useChat();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getMyRequests();
      if (res.data.success) {
        setRequests(res.data.requests || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load my requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleCancel = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to cancel this borrow request?')) {
      return;
    }

    try {
      const res = await requestService.cancel(requestId);
      if (res.data.success) {
        setMessage('Borrow request cancelled successfully.');
        fetchMyRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Borrow Applications</span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-0.5">
          My Outgoing Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the status of items you have requested to borrow from other campus students.
        </p>
      </div>

      {message && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-in fade-in">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Clock className="size-12 text-slate-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-800">No outgoing borrow requests</h3>
          <p className="text-xs text-slate-500 mt-1">
            Need a scientific calculator, book, or tools? Search the catalog and send a request.
          </p>
          <Link
            to="/browse"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
          >
            Browse Available Items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.request_id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={req.resource_image || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150'}
                  alt={req.resource_name}
                  className="size-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-base font-bold text-slate-900">
                      <Link to={`/resources/${req.resource_id}`} className="hover:text-indigo-600">
                        {req.resource_name}
                      </Link>
                    </h3>
                    <StatusBadge status={req.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-500">
                    Owner: <strong className="text-slate-800">{req.owner_name}</strong>
                    {req.owner_email && ` (${req.owner_email})`}
                  </p>

                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Purpose: </span>
                    {req.purpose}
                  </p>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="size-3" />
                    Requested from <strong>{new Date(req.requested_from).toLocaleDateString()}</strong> to <strong>{new Date(req.requested_until).toLocaleDateString()}</strong>
                  </p>
                </div>
              </div>

              {/* Status or Cancel button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => openChat(req.owner_id || 1, req.owner_name || 'Lender', undefined, req.resource_name)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
                  title="Chat with lender"
                >
                  <MessageSquare className="size-3.5" />
                  Chat
                </button>

                {req.status === 'PENDING' ? (
                  <button
                    onClick={() => handleCancel(req.request_id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    <XCircle className="size-3.5" />
                    Cancel Request
                  </button>
                ) : req.status === 'APPROVED' ? (
                  <Link
                    to="/borrowed"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    View in My Loans →
                  </Link>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    Status: {req.status.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
