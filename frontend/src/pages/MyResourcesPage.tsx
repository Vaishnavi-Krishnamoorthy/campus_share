import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/api.js';
import { Resource } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { PlusCircle, Trash2, Eye, Star, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

export const MyResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMyResources = async () => {
    setLoading(true);
    try {
      const res = await resourceService.getMyResources();
      if (res.data.success) {
        setResources(res.data.resources || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load my resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const handleToggleStatus = async (resource: Resource) => {
    if (resource.availability_status === 'BORROWED') {
      setMessage({ type: 'error', text: 'Cannot toggle availability while an item is currently BORROWED.' });
      return;
    }

    const nextStatus = resource.availability_status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

    try {
      const res = await resourceService.update(resource.resource_id, { availability_status: nextStatus });
      if (res.data.success) {
        setMessage({ type: 'success', text: `Status updated to ${nextStatus}.` });
        fetchMyResources();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (!window.confirm(`Are you sure you want to remove "${resource.resource_name}"?`)) {
      return;
    }

    try {
      const res = await resourceService.delete(resource.resource_id);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Resource deleted successfully.' });
        fetchMyResources();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete resource.' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Inventory</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            My Listed Resources
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your listed items, view pending student requests, and toggle availability.
          </p>
        </div>
        <Link
          to="/add-resource"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          <PlusCircle className="size-4" />
          Add Another Resource
        </Link>
      </div>

      {/* Alert banner */}
      {message && (
        <div className={`mb-6 flex items-center justify-between rounded-2xl p-4 text-xs font-bold shadow-sm ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-800">You haven't listed any resources yet.</p>
          <p className="text-xs text-slate-500 mt-1">Share study tools you have at your dorm or desk to help campus peers.</p>
          <Link
            to="/add-resource"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
          >
            <PlusCircle className="size-4" />
            List Your First Resource
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Pending Requests</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {resources.map((item) => (
                  <tr key={item.resource_id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150'}
                          alt={item.resource_name}
                          className="size-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <Link to={`/resources/${item.resource_id}`} className="font-bold text-slate-900 hover:text-indigo-600">
                            {item.resource_name}
                          </Link>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="size-3 text-slate-400" />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.category_name}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        {item.condition}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={item.availability_status} size="sm" />
                    </td>

                    <td className="px-6 py-4">
                      {(item as any).pending_requests_count > 0 ? (
                        <Link
                          to="/lending-requests"
                          className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                        >
                          {(item as any).pending_requests_count} Waiting Approval →
                        </Link>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          disabled={item.availability_status === 'BORROWED'}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                            item.availability_status === 'AVAILABLE'
                              ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          {item.availability_status === 'AVAILABLE' ? 'Mark Inactive' : 'Mark Available'}
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          disabled={item.availability_status === 'BORROWED'}
                          className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
