import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, ShieldCheck, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 font-display text-lg font-extrabold text-slate-900 group">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-200">
                <Share2 className="size-4" />
              </span>
              <span>
                Campus<span className="text-gradient">Share</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              University physical resource sharing platform. Borrow academic essentials, textbooks, and equipment from verified classmates on campus.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse"></span>
              All Campus Systems Live
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 font-display">Popular Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/browse?category=Electronics" className="hover:text-indigo-600 transition">Calculators & Electronics</Link></li>
              <li><Link to="/browse?category=Books" className="hover:text-indigo-600 transition">Course Textbooks & Guides</Link></li>
              <li><Link to="/browse?category=Engineering%20Tools" className="hover:text-indigo-600 transition">Mini Drafters & Calipers</Link></li>
              <li><Link to="/browse?category=Lab%20Equipment" className="hover:text-indigo-600 transition">Lab Coats & Safety Goggles</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 font-display">Trust & Student Safety</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /> Verified University Roll Numbers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" /> Peer Condition Ratings & Reviews</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" /> Automated Due-Date Tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /> Zero Commercial Rental Charges</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 font-display">Administration</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Authorized university administrators can oversee campus inventory, review analytics, and audit loan lifecycles.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <ShieldCheck className="size-3.5 text-amber-600" />
              Access Admin Console →
            </Link>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 CampusShare. Student Resource Sharing & Borrowing Network.</p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/browse" className="hover:text-slate-600 transition">Browse Catalog</Link>
            <Link to="/login" className="hover:text-slate-600 transition">Sign In</Link>
            <Link to="/register" className="hover:text-slate-600 transition">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
