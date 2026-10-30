import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceService } from '../services/api.js';
import { Resource } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { BorrowRequestModal } from '../components/BorrowRequestModal.js';
import { CampusRadarModal } from '../components/CampusRadarModal.js';
import { useAuth } from '../context/AuthContext.js';
import { useChat } from '../context/ChatContext.js';
import { getDefaultAvatar } from '../utils/avatars.js';
import {
  MapPin,
  Star,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  AlertCircle,
  MessageSquare,
  Radio,
  Navigation,
  Compass
} from 'lucide-react';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { openChat } = useChat();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchResource = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await resourceService.getById(id);
      if (res.data.success) {
        setResource(res.data.resource || res.data.data || null);
      }
    } catch (err) {
      console.error('Failed to load resource details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[4/3] bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <AlertCircle className="size-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Resource Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This item may have been removed or does not exist.</p>
        <Link to="/browse" className="mt-4 inline-block text-xs font-bold text-indigo-600">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.student_id === resource.owner_id;
  const isAvailable = resource.availability_status === 'AVAILABLE';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-6"
      >
        <ArrowLeft className="size-4" />
        Back to Resources
      </Link>

      {/* Success banner */}
      {successMessage && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs font-bold text-emerald-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Resource Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
        
        {/* Left Column: Image & Reviews */}
        <div className="space-y-8">
          
          {/* Main Photo Card */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
            <img
              src={resource.image_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800'}
              alt={resource.resource_name}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4">
              <StatusBadge status={resource.availability_status} />
            </div>
            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
                {resource.condition}
              </span>
            </div>
          </div>

          {/* Student Reviews Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Reviews & Ratings</h3>
                <p className="text-xs text-slate-500">Feedback from classmates who previously borrowed this resource</p>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="text-lg font-display">{resource.avg_rating}</span>
                <span className="text-xs text-slate-400">({resource.total_reviews} reviews)</span>
              </div>
            </div>

            {(!resource.reviews || resource.reviews.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No reviews yet for this resource. Be the first to borrow and leave feedback!
              </p>
            ) : (
              <div className="space-y-4">
                {resource.reviews.map((rev) => (
                  <div key={rev.review_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={rev.reviewer_name}
                          className="size-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.reviewer_name}</p>
                          <p className="text-[10px] text-slate-400">{rev.reviewer_department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${
                              rev.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-600 leading-relaxed pl-9">
                        "{rev.comment}"
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-2 pl-9">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Information & Request Action */}
        <div className="space-y-6">
          
          {/* Metadata Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {resource.category_name}
            </span>

            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight">
              {resource.resource_name}
            </h1>

            {/* Location & Live Radar */}
            <div className="mt-3">
              <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <MapPin className="size-4 text-indigo-600 shrink-0" />
                <span>Campus Location: <strong>{resource.location}</strong></span>
              </p>

              <button
                type="button"
                onClick={() => setIsRadarOpen(true)}
                className="w-full mt-2.5 inline-flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 transition"
              >
                <span className="flex items-center gap-2">
                  <Radio className="size-4 text-emerald-500 animate-pulse" />
                  <span>Live Distance & Walk Radar</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">
                  <Compass className="size-3.5" />
                  Check Proximity →
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Specs Tags */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Condition</span>
                <span className="font-bold text-slate-800">{resource.condition}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Availability</span>
                <span className="font-bold text-slate-800">{resource.availability_status}</span>
              </div>
            </div>

            {/* CTA Request Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isOwner ? (
                <div className="rounded-2xl bg-indigo-50 p-4 text-center text-xs font-bold text-indigo-700">
                  You own this resource listing.
                </div>
              ) : isAvailable ? (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = '/login';
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                >
                  <Calendar className="size-4" />
                  Request to Borrow This Resource
                </button>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 dark:bg-slate-800 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed"
                >
                  Resource is currently {resource.availability_status}
                </button>
              )}

              {/* Chat With Owner Button */}
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = '/login';
                      return;
                    }
                    openChat(
                      resource.owner_id,
                      resource.owner_name || 'Owner',
                      resource.owner_avatar || getDefaultAvatar(resource.owner_name),
                      resource.resource_name
                    );
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 py-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition shadow-xs"
                >
                  <MessageSquare className="size-4 text-indigo-600 dark:text-indigo-400" />
                  Chat Directly with {resource.owner_name?.split(' ')[0] || 'Owner'}
                </button>
              )}
            </div>

          </div>

          {/* Owner Profile Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Resource Owner Details
            </h4>
            <div className="flex items-center gap-3.5">
              <img
                src={resource.owner_avatar || getDefaultAvatar(resource.owner_name)}
                alt={resource.owner_name}
                className="size-12 rounded-2xl object-cover border border-indigo-100 dark:border-indigo-900 bg-indigo-50 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{resource.owner_name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {resource.owner_department} · Year {resource.owner_year}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-400">
              {resource.owner_email && (
                <p className="flex items-center gap-2">
                  <Mail className="size-3.5 text-slate-400" />
                  <span>{resource.owner_email}</span>
                </p>
              )}
              {resource.owner_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="size-3.5 text-slate-400" />
                  <span>{resource.owner_phone}</span>
                </p>
              )}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                <ShieldCheck className="size-3.5" />
                Verified Student on Campus
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Borrow Request Modal */}
      {resource && (
        <BorrowRequestModal
          resource={resource}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setSuccessMessage(`Your request to borrow "${resource.resource_name}" was submitted to ${resource.owner_name}!`);
            fetchResource();
          }}
        />
      )}

      {/* Campus Radar Modal */}
      {resource && (
        <CampusRadarModal
          isOpen={isRadarOpen}
          onClose={() => setIsRadarOpen(false)}
          targetLocationName={resource.location}
          targetPersonName={resource.owner_name}
          onMeetupRequest={(spot) => {
            openChat(
              resource.owner_id,
              resource.owner_name || 'Owner',
              resource.owner_avatar || getDefaultAvatar(resource.owner_name),
              resource.resource_name
            );
          }}
        />
      )}

    </div>
  );
};
