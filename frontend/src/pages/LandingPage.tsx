import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../services/api.js';
import { Resource } from '../types/index.js';
import { ResourceCard } from '../components/ResourceCard.js';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  PackageCheck,
  CalendarDays,
  CheckCircle2,
  Cpu,
  BookOpen,
  Wrench,
  FlaskConical,
  PenTool,
  Plug,
  Layers,
  Star,
  Users,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularResources, setPopularResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await resourceService.getAll();
        if (res.data.success) {
          const list = res.data.resources || res.data.data || [];
          setPopularResources(list.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch landing resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const categories = [
    { name: 'Electronics', icon: Cpu, count: 'Calculators, tablets, tech gear', color: 'from-blue-500/10 to-indigo-500/10 text-indigo-600' },
    { name: 'Books', icon: BookOpen, count: 'Textbooks, study guides, notes', color: 'from-amber-500/10 to-orange-500/10 text-amber-600' },
    { name: 'Lab Equipment', icon: FlaskConical, count: 'Lab coats, goggles, dissection kits', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600' },
    { name: 'Engineering Tools', icon: Wrench, count: 'Mini drafters, calipers, tools', color: 'from-violet-500/10 to-purple-500/10 text-violet-600' },
    { name: 'Stationery', icon: PenTool, count: 'Geometry boxes, markers, binders', color: 'from-pink-500/10 to-rose-500/10 text-pink-600' },
    { name: 'Accessories', icon: Plug, count: 'Chargers, adapters, flash drives', color: 'from-cyan-500/10 to-blue-500/10 text-cyan-600' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION WITH AMBIENT GLOW */}
      <section className="landing-hero relative overflow-hidden border-b border-indigo-100/80 pt-8 pb-16 lg:py-24">
        <div className="subtle-grid absolute inset-0 opacity-40"></div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          
          {/* Left Column: Hero Copy & Search */}
          <div className="lg:col-span-7">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-indigo-200/80 px-4 py-1.5 text-xs font-extrabold text-indigo-700 shadow-sm backdrop-blur-md">
              <span className="flex size-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Campus Resource Sharing Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">100% Free Peer-to-Peer</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl font-display leading-[1.12]">
              Borrow Academic Gear. <br />
              <span className="text-gradient">Share With Classmates.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Never buy expensive scientific calculators, course textbooks, lab coats, or drafting tools for a single semester. Connect directly with students on campus and borrow in minutes.
            </p>

            {/* Modern Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row max-w-xl items-stretch rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl shadow-indigo-500/5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100/60 transition-all">
              <div className="flex items-center gap-3 pl-3 flex-1 text-slate-400 py-1.5">
                <Search className="size-5 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Search calculators, CLRS textbooks, drafters, chargers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm shrink-0"
              >
                Find Gear
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Quick Keyword Links */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Casio Calculator', 'CLRS Algorithm Book', 'Lab Coat', 'Mini Drafter'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/browse?q=${encodeURIComponent(tag)}`);
                  }}
                  className="rounded-lg bg-white/80 border border-slate-200/70 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap gap-6 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                Verified Student IDs
              </span>
              <span className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-indigo-600" />
                Trusted Student Reviews
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Zero Rental Fees
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-indigo-500/10 hover-lift transition-all duration-300">
              
              {/* Header inside preview card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs">
                    CS
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Featured Campus Listing</h4>
                    <p className="text-[10px] text-slate-400">Engineering Complex • Block B</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                  Ready to Borrow
                </span>
              </div>

              {/* Resource Image & Details */}
              <div className="mt-4 relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1757256137041-0aab889db199?w=600&auto=format&fit=crop&q=80"
                  alt="Casio FX-991EX ClassWiz Scientific Calculator"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                  Like New
                </div>
              </div>

              {/* Title & Stats */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">
                    Electronics
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>4.8 (12 loans)</span>
                  </div>
                </div>

                <h3 className="mt-1 text-base font-bold text-slate-900">
                  Casio FX-991EX ClassWiz Calculator
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  Complete with solar panel, cover, and reference card. Available for semester exams or lab sessions.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="grid size-6 place-items-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                      A
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 text-[11px] leading-tight">Ananya S.</p>
                      <p className="text-[10px] text-slate-400">Comp. Science '26</p>
                    </div>
                  </div>
                  <Link
                    to="/browse"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    Request Item
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <section className="border-b border-slate-200/70 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <strong className="text-3xl font-extrabold text-slate-900 font-display">₹0</strong>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Zero Borrowing Cost</p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <strong className="text-3xl font-extrabold text-indigo-600 font-display">7+</strong>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Categories</p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <strong className="text-3xl font-extrabold text-slate-900 font-display">100%</strong>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Students</p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <strong className="text-3xl font-extrabold text-indigo-600 font-display">Instant</strong>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Online Requests</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Categories</span>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 font-display">
              Explore Campus Essentials
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Find exactly what you need for lab sessions, semester projects, and exams.
            </p>
          </div>
          <Link
            to="/browse"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Categories
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 text-left"
              >
                <div className={`size-11 rounded-xl bg-gradient-to-tr ${cat.color} grid place-items-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.count}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. RECENTLY LISTED RESOURCES SHOWCASE */}
      <section className="bg-slate-100/60 border-y border-slate-200/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Available Now</span>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-900 font-display">
                Featured Campus Resources
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Fresh items listed by students across various campus departments.
              </p>
            </div>
            <Link
              to="/browse"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Compass className="size-4 text-indigo-600" />
              Browse Full Catalog
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : popularResources.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-bold text-slate-700">No resources available right now.</p>
              <Link to="/add-resource" className="mt-3 inline-block rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white">
                Be the first to share!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularResources.map((res) => (
                <ResourceCard key={res.resource_id} resource={res} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS 4 STEPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Simple 4-Step Flow</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 font-display">
            How CampusShare Works
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            A safe, transparent cycle designed specifically for collegiate life and academic trust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-lg">
            <span className="absolute top-4 right-5 text-2xl font-extrabold text-indigo-100 font-display">01</span>
            <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center mb-5 font-bold">
              <Search className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Browse & Find</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Search by title, course department, or category. Check the item's condition rating and location on campus.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-lg">
            <span className="absolute top-4 right-5 text-2xl font-extrabold text-indigo-100 font-display">02</span>
            <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center mb-5 font-bold">
              <CalendarDays className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Request Dates</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Select your required borrowing duration, state your academic purpose, and send a request directly to the owner.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-lg">
            <span className="absolute top-4 right-5 text-2xl font-extrabold text-indigo-100 font-display">03</span>
            <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center mb-5 font-bold">
              <HeartHandshake className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Meet & Collect</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Upon approval, meet the owner at their designated campus spot (library, student lounge, or department lab).
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-lg">
            <span className="absolute top-4 right-5 text-2xl font-extrabold text-indigo-100 font-display">04</span>
            <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center mb-5 font-bold">
              <Star className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Return & Review</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Hand the item back before the due date. Leave a review to help build a trustworthy campus community.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              Join Campus Sharing
            </span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl font-display leading-tight">
              Have textbooks or equipment lying idle in your dorm?
            </h2>
            <p className="mt-3 text-sm text-indigo-100 leading-relaxed">
              Help your juniors and fellow classmates. List your items on CampusShare and foster a circular campus economy.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/add-resource"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-50 transition shadow-lg"
              >
                List a Resource
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition backdrop-blur-md"
              >
                Browse Available Gear
              </Link>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-1/4 size-60 rounded-full bg-violet-400/20 blur-2xl pointer-events-none"></div>
        </div>
      </section>

    </div>
  );
};
