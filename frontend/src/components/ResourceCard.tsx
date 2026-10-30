import React from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';
import { getDefaultAvatar } from '../utils/avatars.js';
import { Star, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const isAvailable = resource.availability_status === 'AVAILABLE';
  const ownerAvatar = resource.owner_avatar || getDefaultAvatar(resource.owner_name);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 animate-fade-in">
      
      {/* Image Container with Ambient Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <img
          src={resource.image_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600'}
          alt={resource.resource_name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Availability Badge */}
        <div className="absolute left-3 top-3">
          <StatusBadge status={resource.availability_status} size="sm" />
        </div>

        {/* Condition Tag */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            {resource.condition}
          </span>
        </div>

        {/* Category Pill Overlaid at Bottom Left of Image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="inline-block rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-400 shadow-sm border border-white/60 dark:border-slate-800">
            {resource.category_name}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        
        {/* Rating & Total Reviews */}
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-amber-50/90 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-900/60">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-extrabold">{resource.avg_rating || 5.0}</span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({resource.total_reviews || 0})
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="size-3 text-indigo-500" />
            Free to Borrow
          </span>
        </div>

        {/* Resource Title */}
        <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link to={`/resources/${resource.resource_id}`}>
            {resource.resource_name}
          </Link>
        </h3>

        {/* Campus Pickup Location */}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <MapPin className="size-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{resource.location}</span>
        </p>

        {/* Description snippet */}
        <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {resource.description}
        </p>

        {/* Footer info: Cute Character Avatar + CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={ownerAvatar}
              alt={resource.owner_name}
              className="size-7.5 rounded-full object-cover border border-indigo-200 dark:border-indigo-800 bg-indigo-50 shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1 max-w-[110px]">
                  {resource.owner_name}
                </span>
                <span title="Verified Campus Student" className="inline-flex">
                  <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                </span>
              </div>
              {resource.owner_department && (
                <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[110px]">
                  {resource.owner_department}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/resources/${resource.resource_id}`}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isAvailable
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 group-hover:translate-x-0.5'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isAvailable ? 'Borrow' : 'Details'}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
};
