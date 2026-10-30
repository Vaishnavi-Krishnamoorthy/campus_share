import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Clock,
  Radio,
  CheckCircle2,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  CAMPUS_SPOTS,
  getCurrentUserLiveLocation,
  setUserLiveLocation,
  calculateCampusDistance,
  calculateWalkMinutes,
  CampusSpot
} from '../utils/campusLocations.js';

interface CampusRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLocationName?: string;
  targetPersonName?: string;
  onMeetupRequest?: (spotName: string) => void;
}

export const CampusRadarModal: React.FC<CampusRadarModalProps> = ({
  isOpen,
  onClose,
  targetLocationName = 'Engineering Library (2nd Floor)',
  targetPersonName = 'Resource Owner',
  onMeetupRequest
}) => {
  const [userLoc, setUserLoc] = useState(() => getCurrentUserLiveLocation());
  const [selectedMySpot, setSelectedMySpot] = useState(userLoc.spotName);
  const [requestSent, setRequestSent] = useState(false);

  if (!isOpen) return null;

  // Find target spot in database or fallback
  const targetSpot =
    CAMPUS_SPOTS.find((s) => s.name.toLowerCase().includes(targetLocationName.toLowerCase())) ||
    CAMPUS_SPOTS[0];

  const mySpot =
    CAMPUS_SPOTS.find((s) => s.name === selectedMySpot) ||
    CAMPUS_SPOTS[1];

  const distanceMeters = calculateCampusDistance(mySpot.lat, mySpot.lng, targetSpot.lat, targetSpot.lng);
  const walkMinutes = calculateWalkMinutes(distanceMeters);

  const handleUpdateSpot = (spot: CampusSpot) => {
    setSelectedMySpot(spot.name);
    const updated = setUserLiveLocation(spot);
    setUserLoc(updated);
  };

  const handleSendMeetup = () => {
    setRequestSent(true);
    if (onMeetupRequest) {
      onMeetupRequest(targetSpot.name);
    }
    setTimeout(() => {
      setRequestSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="grid size-9 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Radio className="size-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              Campus Live Location Radar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track live proximity to borrow items immediately on campus.
            </p>
          </div>
        </div>

        {/* Radar Graphic View */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-4 flex items-center justify-center">
          
          {/* Concentric Radar Rings */}
          <div className="absolute size-40 rounded-full border border-indigo-500/20"></div>
          <div className="absolute size-28 rounded-full border border-indigo-500/30"></div>
          <div className="absolute size-16 rounded-full border border-indigo-500/40"></div>
          <div className="absolute w-full h-[1px] bg-indigo-500/10"></div>
          <div className="absolute h-full w-[1px] bg-indigo-500/10"></div>

          {/* Rotating radar sweep */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-transparent to-indigo-500/15 animate-spin origin-center" style={{ animationDuration: '6s' }}></div>

          {/* Target Location Beacon (Lender) */}
          <div className="absolute top-10 right-16 flex flex-col items-center">
            <span className="relative flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </span>
            <div className="mt-1 rounded-md bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 shadow-sm backdrop-blur-sm">
              {targetPersonName}
            </div>
          </div>

          {/* User Location Beacon (Borrower) */}
          <div className="absolute bottom-10 left-16 flex flex-col items-center">
            <span className="relative flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            </span>
            <div className="mt-1 rounded-md bg-indigo-950/80 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30 shadow-sm backdrop-blur-sm">
              You (Borrower)
            </div>
          </div>

          {/* Live Proximity Metric Banner */}
          <div className="absolute bottom-2.5 rounded-full bg-slate-900/90 px-3.5 py-1 text-xs font-extrabold text-white border border-indigo-500/30 shadow-md backdrop-blur-md flex items-center gap-2">
            <Navigation className="size-3.5 text-indigo-400" />
            <span>~{distanceMeters} meters away</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Clock className="size-3" />
              {walkMinutes} min walk
            </span>
          </div>
        </div>

        {/* Location Info Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Owner's Live Spot
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{targetSpot.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{targetSpot.zone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Your Current Spot
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{mySpot.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{mySpot.zone}</p>
          </div>
        </div>

        {/* Quick Spot Switcher */}
        <div className="mt-4">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Change Your Spot to Test Distance:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] flex items-center gap-1">
              <RefreshCw className="size-2.5" /> Auto-updates walk time
            </span>
          </label>
          <select
            value={selectedMySpot}
            onChange={(e) => {
              const spot = CAMPUS_SPOTS.find((s) => s.name === e.target.value);
              if (spot) handleUpdateSpot(spot);
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CAMPUS_SPOTS.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.zone})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSendMeetup}
            disabled={requestSent}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
          >
            {requestSent ? (
              <>
                <CheckCircle2 className="size-4" />
                Meetup Requested at {targetSpot.name}!
              </>
            ) : (
              <>
                <Compass className="size-4" />
                Request Meetup at {targetSpot.zone}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
