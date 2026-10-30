import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { authService } from '../services/api.js';
import { CUTE_AVATARS, getDefaultAvatar } from '../utils/avatars.js';
import { CAMPUS_SPOTS, getCurrentUserLiveLocation, setUserLiveLocation } from '../utils/campusLocations.js';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Phone,
  ShieldCheck,
  Package,
  CheckCircle2,
  Calendar,
  Save,
  Check,
  Sparkles,
  MapPin,
  Radio,
  RefreshCw,
  Smile
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [year, setYear] = useState<number>(user?.year || 3);
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image || getDefaultAvatar(user?.name));
  
  // Live location state
  const [userLoc, setUserLoc] = useState(() => getCurrentUserLiveLocation());
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const departments = [
    'Computer Science',
    'Information Technology',
    'Mechanical Engineering',
    'Electrical & Electronics',
    'Civil Engineering',
    'Chemical & Bio-Engineering',
    'Biotechnology',
    'Business & Economics',
    'Physics & Mathematics',
    'General Engineering'
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await authService.updateProfile({
        name,
        email,
        department,
        year: Number(year),
        phone,
        profile_image: profileImage,
      });

      if (res.data.success) {
        setSuccess(true);
        await refreshUser();
        setTimeout(() => setSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectSpot = (spotName: string) => {
    const spot = CAMPUS_SPOTS.find((s) => s.name === spotName);
    if (spot) {
      const updated = setUserLiveLocation(spot);
      setUserLoc(updated);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 mb-2">
          <Smile className="size-3.5 text-indigo-600" />
          Student Identity & Avatar
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          My Campus Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your cute character avatar, edit your academic details, and manage your live campus location.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Preview & Live Spot Card */}
        <div className="space-y-6">
          
          {/* Main Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-center flex flex-col items-center hover-lift transition-all">
            <div className="relative mb-4">
              <img
                src={profileImage}
                alt={name}
                className="size-28 rounded-3xl object-cover border-4 border-indigo-100 dark:border-indigo-950 bg-indigo-50 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 grid size-7 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-slate-900 shadow-sm" title="Verified Campus Student">
                <Check className="size-4 stroke-[3]" />
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{name || 'Your Name'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{department}</p>
            
            <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase">
                Year {year} Student
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                Verified ID
              </span>
            </div>

            {/* Live Campus Spot */}
            <div className="mt-6 w-full rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 dark:from-indigo-950/30 dark:to-slate-800/40 p-3.5 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Radio className="size-3 text-emerald-500 animate-pulse" />
                  Live Campus Spot
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Broadcasted</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {userLoc.spotName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Zone: {userLoc.zone}
              </p>
            </div>

            <div className="mt-5 w-full border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student ID:</span>
                <strong className="text-slate-800 dark:text-slate-200">{user?.student_number || 'STU-100'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Role:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{user?.role || 'STUDENT'}</strong>
              </div>
            </div>
          </div>

          {/* Quick Location Switcher Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-indigo-600" />
              Update My Live Location
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Borrowers can see where to meet you on campus when requesting your items.
            </p>
            <select
              value={userLoc.spotName}
              onChange={(e) => handleSelectSpot(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CAMPUS_SPOTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.zone})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Right Column: Cute Character Picker + Editable Academic Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Cute Character Avatar Gallery */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  Pick Your Cute Character Avatar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click on any cute character to make it your campus profile icon!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {CUTE_AVATARS.map((avatar) => {
                const isSelected = profileImage === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setProfileImage(avatar.url)}
                    className={`group relative flex flex-col items-center rounded-2xl p-2.5 border transition-all text-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-400 shadow-md scale-105'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 hover:scale-105'
                    }`}
                  >
                    <div className="size-14 rounded-2xl overflow-hidden mb-1.5 p-1 bg-white dark:bg-slate-800 shadow-xs">
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                      {avatar.name}
                    </span>
                    <span className="text-[9px] text-slate-400 line-clamp-1">
                      {avatar.characterType}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-indigo-600 text-white shadow-xs">
                        <Check className="size-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Academic Information Form */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              Editable Student Information
            </h3>

            {success && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile updated successfully! All changes are live across CampusShare.</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="size-3.5 text-indigo-600" />
                    Full Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="size-3.5 text-indigo-600" />
                    Campus Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-indigo-600" />
                    Academic Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-indigo-600" />
                    Year of Study *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value={1}>Year 1 (Freshman)</option>
                    <option value={2}>Year 2 (Sophomore)</option>
                    <option value={3}>Year 3 (Junior)</option>
                    <option value={4}>Year 4 (Senior)</option>
                    <option value={5}>Postgraduate / Masters</option>
                  </select>
                </div>
              </div>

              {/* Phone & Custom Avatar Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="size-3.5 text-indigo-600" />
                    Phone Number (For pickup call/SMS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-0101"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-indigo-600" />
                    Custom Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transition"
                >
                  <Save className="size-4" />
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
