import React, { useState } from 'react';
import { Resource } from '../types/index.js';
import { requestService } from '../services/api.js';
import { X, Calendar, Send, AlertCircle } from 'lucide-react';

interface BorrowRequestModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({
  resource,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [requestedFrom, setRequestedFrom] = useState(today);
  const [requestedUntil, setRequestedUntil] = useState(nextWeek);
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!purpose.trim()) {
      setError('Please specify the purpose of borrowing.');
      return;
    }

    if (new Date(requestedUntil) < new Date(requestedFrom)) {
      setError('Return date cannot be earlier than borrowing date.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestService.create({
        resource_id: resource.resource_id,
        requested_from: requestedFrom,
        requested_until: requestedUntil,
        purpose,
        message,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit borrow request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Request to Borrow</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{resource.resource_name}</p>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-indigo-600" />
                From Date
              </label>
              <input
                type="date"
                min={today}
                value={requestedFrom}
                onChange={(e) => setRequestedFrom(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-indigo-600" />
                Until Date
              </label>
              <input
                type="date"
                min={requestedFrom}
                value={requestedUntil}
                onChange={(e) => setRequestedUntil(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Purpose / Reason for Borrowing *
            </label>
            <input
              type="text"
              placeholder="e.g. Preparing for Calculus semester exam"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Message to Owner ({resource.owner_name}) (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Can meet you at Central Library or CSE block anytime tomorrow afternoon."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send className="size-3.5" />
              {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
