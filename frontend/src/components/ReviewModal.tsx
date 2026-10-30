import React, { useState } from 'react';
import { reviewService } from '../services/api.js';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface ReviewModalProps {
  borrowingId: number;
  resourceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  borrowingId,
  resourceName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await reviewService.create({
        borrowing_id: borrowingId,
        rating,
        comment,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Leave a Review</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{resourceName}</p>
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

          {/* Star Rating Picker */}
          <div className="text-center py-2">
            <p className="text-xs font-semibold text-slate-600 mb-2">How was your borrowing experience?</p>
            <div className="inline-flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    className={`size-7 transition ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {rating === 5 && 'Outstanding · 5 Stars'}
              {rating === 4 && 'Very Good · 4 Stars'}
              {rating === 3 && 'Average · 3 Stars'}
              {rating === 2 && 'Below Expectations · 2 Stars'}
              {rating === 1 && 'Poor · 1 Star'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Comment / Feedback (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Was the item clean and functional? Did the owner communicate well?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <CheckCircle className="size-3.5" />
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
