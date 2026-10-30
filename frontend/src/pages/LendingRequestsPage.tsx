import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api.js';
import { BorrowRequest } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { useChat } from '../context/ChatContext.js';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

export const LendingRequestsPage: React.FC = () => {
  const { openChat } = useChat();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchReceivedRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getReceivedRequests();
      if (res.data.success) {
        setRequests(res.data.requests || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load received requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const handleApprove = async (request: BorrowRequest) => {
    if (!window.confirm(`Approve borrow request from ${request.borrower_name} for "${request.resource_name}"?`)) {
      return;
    }

    try {
      const res = await requestService.approve(request.request_id);
      if (res.data.success) {
        setActionMessage(`Request #${request.request_id} approved successfully! The resource has been marked as lent.`);
        fetchReceivedRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not approve request.');
    }
  };

  const handleReject = async (request: BorrowRequest) => {
    if (!window.confirm(`Decline borrow request from ${request.borrower_name}?`)) {
      return;
    }

    try {
      const res = await requestService.reject(request.request_id);
      if (res.data.success) {
        setActionMessage(`Request #${request.request_id} was declined.`);
        fetchReceivedRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to decline request.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Lending Management</span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-0.5">
          Incoming Lending Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review and respond to borrow requests from classmates for your listed resources.
        </p>
      </div>

      {/* Action alert banner */}
      {actionMessage && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Inbox className="size-12 text-slate-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-800">No incoming lending requests</h3>
          <p className="text-xs text-slate-500 mt-1">
            When other campus students request to borrow your listed resources, their requests will appear here for your approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.request_id}
              className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                req.status === 'PENDING' ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left: Resource & Borrower Details */}
                <div className="flex items-start gap-4">
                  <img
                    src={req.resource_image || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150'}
                    alt={req.resource_name}
                    className="size-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {req.resource_name}
                      </h3>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    {/* Borrower Profile */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <User className="size-3 text-indigo-600" />
                        {req.borrower_name}
                      </span>
                      <span>·</span>
                      <span>{req.borrower_department}</span>
                      <span>·</span>
                      <span>Year {req.borrower_year || 2}</span>
                      {req.borrower_phone && (
                        <>
                          <span>·</span>
                          <span className="text-slate-500">Ph: {req.borrower_phone}</span>
                        </>
                      )}
                    </div>

                    {/* Purpose & dates */}
                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <p>
                        <span className="font-bold text-slate-700">Purpose: </span>
                        {req.purpose}
                      </p>
                      {req.message && (
                        <p className="italic text-slate-500">
                          "{req.message}"
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <Calendar className="size-3 text-slate-400" />
                        Requested Duration: <strong>{new Date(req.requested_from).toLocaleDateString()}</strong> to <strong>{new Date(req.requested_until).toLocaleDateString()}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => openChat(req.borrower_id || 1, req.borrower_name || 'Borrower', undefined, req.resource_name)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
                    title="Coordinate meetup"
                  >
                    <MessageSquare className="size-3.5" />
                    Chat
                  </button>

                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleReject(req)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <XCircle className="size-4 text-slate-400" />
                        Decline
                      </button>

                      <button
                        onClick={() => handleApprove(req)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
                      >
                        <CheckCircle className="size-4" />
                        Approve Request
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Request is already {req.status.toLowerCase()}
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
