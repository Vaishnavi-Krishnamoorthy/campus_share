import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (normalized) {
    case 'AVAILABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 backdrop-blur-md ${padding}`}>
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse"></span>
          Available
        </span>
      );
    case 'BORROWED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 backdrop-blur-md ${padding}`}>
          <span className="size-1.5 rounded-full bg-rose-500"></span>
          Borrowed
        </span>
      );
    case 'PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 backdrop-blur-md ${padding}`}>
          <span className="size-1.5 rounded-full bg-amber-500"></span>
          Pending
        </span>
      );
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 backdrop-blur-md ${padding}`}>
          <span className="size-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]"></span>
          Active Loan
        </span>
      );
    case 'OVERDUE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-extrabold rounded-full bg-red-100 text-red-800 border border-red-300 animate-pulse ${padding}`}>
          <span className="size-1.5 rounded-full bg-red-600"></span>
          OVERDUE
        </span>
      );
    case 'RETURNED':
    case 'COMPLETED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${padding}`}>
          <span className="size-1.5 rounded-full bg-slate-400"></span>
          Returned
        </span>
      );
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${padding}`}>
          <span className="size-1.5 rounded-full bg-emerald-500"></span>
          Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${padding}`}>
          <span className="size-1.5 rounded-full bg-slate-400"></span>
          Rejected
        </span>
      );
    case 'CANCELLED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200 ${padding}`}>
          <span className="size-1.5 rounded-full bg-slate-400"></span>
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-slate-100 text-slate-700 ${padding}`}>
          {status}
        </span>
      );
  }
};
