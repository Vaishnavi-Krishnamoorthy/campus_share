import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Share2, Lock, Mail, User, Phone, GraduationCap, AlertCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_number: '',
    department: 'Computer Science',
    year: '3',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const departments = [
    'Computer Science',
    'Mechanical Engineering',
    'Electronics & Comm.',
    'Electrical Engineering',
    'Civil Engineering',
    'Biotechnology',
    'Data Science',
    'Mathematics'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        student_number: formData.student_number,
        department: formData.department,
        year: parseInt(formData.year, 10),
        phone: formData.phone || undefined,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 font-display text-2xl font-extrabold text-slate-900 group">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Share2 className="size-6" />
            </span>
            <span>
              Campus<span className="text-gradient">Share</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 font-display">
            Create Student Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join your university resource network to borrow gear and share with peers.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-xl shadow-indigo-500/5">
          
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-700">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="size-3.5 text-indigo-600" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />
            </div>

            {/* Email & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-indigo-600" />
                  Campus Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="size-3.5 text-indigo-600" />
                  Roll Number / Student ID *
                </label>
                <input
                  type="text"
                  name="student_number"
                  required
                  placeholder="e.g. CS-2024-042"
                  value={formData.student_number}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
                />
              </div>
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-indigo-600" />
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  <option value="1">1st Year (Freshman)</option>
                  <option value="2">2nd Year (Sophomore)</option>
                  <option value="3">3rd Year (Junior)</option>
                  <option value="4">4th Year (Senior)</option>
                  <option value="5">5th Year (Postgrad / Dual)</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="size-3.5 text-indigo-600" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-indigo-600" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min. 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account & Enter Campus
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};
