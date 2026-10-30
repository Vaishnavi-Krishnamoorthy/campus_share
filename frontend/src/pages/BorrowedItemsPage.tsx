import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowingService } from '../services/api.js';
import { Borrowing } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { ReviewModal } from '../components/ReviewModal.js';
import {
  Package,
  Calendar,
  Clock,
  RotateCcw,
  Star,
  CheckCircle,
  AlertTriangle,
  User,
  ArrowRight
} from 'lucide-react';

export const BorrowedItemsPage: React.FC = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBorrowingForReview, setSelectedBorrowingForReview] = useState<Borrowing | null>(null);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const res = await borrowingService.getBorrowed();
      if (res.data.success) {
        setBorrowings(res.data.borrowings || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load borrowings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleReturn = async (borrowing: Borrowing) => {
    if (!window.confirm(`Confirm return of "${borrowing.resource_name}" to ${borrowing.owner_name}?`)) {
      return;
    }

    try {
      const res = await borrowingService.returnResource(borrowing.borrowing_id);
      if (res.data.success) {
        setActionMessage(`"${borrowing.resource_name}" has been marked as returned! Thank you for sharing responsibly.`);
        await fetchBorrowings();
        // Automatically offer review
        setSelectedBorrowingForReview(borrowing);
        setReviewModalOpen(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return resource.');
    }
  };

  const activeItems = borrowings.filter((b) => b.status === 'ACTIVE' || b.status === 'OVERDUE');
  const historyItems = borrowings.filter((b) => b.status === 'RETURNED');

  const displayedItems = selectedTab === 'ACTIVE' ? activeItems : historyItems;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Borrowing Ledger</span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-0.5">
          My Borrowed Resources
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your active student loans, track due dates, trigger return transactions, and write feedback.
        </p>
      </div>

      {/* Success banner */}
      {actionMessage && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="underline">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedTab('ACTIVE')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            selectedTab === 'ACTIVE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Currently Borrowed ({activeItems.length})
        </button>

        <button
          onClick={() => setSelectedTab('HISTORY')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            selectedTab === 'HISTORY'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Return History ({historyItems.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Package className="size-12 text-slate-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-slate-800">
            {selectedTab === 'ACTIVE' ? 'No active resource loans' : 'No return history recorded'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {selectedTab === 'ACTIVE'
              ? 'You do not currently have any borrowed physical items.'
              : 'Items you return in the future will be logged here.'}
          </p>
          {selectedTab === 'ACTIVE' && (
            <Link
              to="/browse"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
            >
              Browse Available Resources
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((item) => (
            <div
              key={item.borrowing_id}
              className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                item.status === 'OVERDUE' ? 'border-red-300 bg-red-50/20 ring-1 ring-red-200' : 'border-slate-200'
              }`}
            >
              <div>
                
                {/* Header: Status & Due Alert */}
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={item.status} size="sm" />
                  {item.status === 'OVERDUE' ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600">
                      <AlertTriangle className="size-3.5" />
                      Past Due!
                    </span>
                  ) : item.status === 'ACTIVE' ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      <Clock className="size-3.5" />
                      {item.days_remaining} days remaining
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600">
                      Returned on {item.return_date ? new Date(item.return_date).toLocaleDateString() : 'Date recorded'}
                    </span>
                  )}
                </div>

                {/* Resource Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={item.resource_image || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150'}
                    alt={item.resource_name}
                    className="size-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      <Link to={`/resources/${item.resource_id}`} className="hover:text-indigo-600">
                        {item.resource_name}
                      </Link>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Owner: <strong>{item.owner_name}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Borrowed on {new Date(item.borrow_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Dates card */}
                <div className="rounded-xl bg-slate-50 p-3 mb-4 text-xs space-y-1 text-slate-600">
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Due Date:</span>
                    <strong className={item.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-800'}>
                      {new Date(item.due_date).toLocaleDateString()}
                    </strong>
                  </p>
                  {item.owner_phone && (
                    <p className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Owner Contact:</span>
                      <span>{item.owner_phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {item.status === 'ACTIVE' || item.status === 'OVERDUE' ? (
                  <button
                    onClick={() => handleReturn(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
                  >
                    <RotateCcw className="size-3.5" />
                    Mark as Returned
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    {item.is_reviewed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        Reviewed ({item.user_rating}★)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBorrowingForReview(item);
                          setReviewModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition"
                      >
                        <Star className="size-3.5 fill-white" />
                        Write Review (1-5★)
                      </button>
                    )}

                    <Link
                      to={`/resources/${item.resource_id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      View Details →
                    </Link>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedBorrowingForReview && (
        <ReviewModal
          borrowingId={selectedBorrowingForReview.borrowing_id}
          resourceName={selectedBorrowingForReview.resource_name}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBorrowingForReview(null);
          }}
          onSuccess={() => {
            setActionMessage('Thank you! Your review and rating have been recorded.');
            fetchBorrowings();
          }}
        />
      )}

    </div>
  );
};
