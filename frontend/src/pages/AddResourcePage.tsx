import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService, categoryService } from '../services/api.js';
import { Category } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  PlusCircle,
  Image,
  MapPin,
  Tag,
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Star,
  ShieldCheck,
  UploadCloud,
  Camera,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const AddResourcePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    resource_name: '',
    category_id: '1',
    description: '',
    condition: 'Like New',
    location: '',
    image_url: '', // User must upload or choose
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAll();
        const cats = res.data.categories || res.data.data || [];
        if (res.data.success && cats.length > 0) {
          setCategories(cats);
          setFormData((prev) => ({ ...prev, category_id: String(cats[0].category_id) }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const imagePresets = [
    { label: 'Casio Calculator', url: 'https://images.unsplash.com/photo-1757256137041-0aab889db199?w=600' },
    { label: 'Course Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600' },
    { label: 'Lab Coat & Goggles', url: 'https://images.unsplash.com/photo-1562789233-775b82d35c16?w=600' },
    { label: 'Drawing Kit / Drafter', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600' },
    { label: 'Laptop Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600' },
    { label: 'USB / Flash Drive', url: 'https://images.unsplash.com/photo-1551818014-7c8ace9c1b5c?w=600' },
    { label: 'Arduino / IoT Kit', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' }
  ];

  const quickLocations = [
    'Central Library (2nd Floor)',
    'Engineering Block B',
    'Science Lab Complex',
    'Student Center Lounge',
    'Hostel 4 Common Room'
  ];

  const currentCategory = categories.find((c) => String(c.category_id) === formData.category_id) || categories[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, image_url: result }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFileName('');
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.resource_name.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in the resource title, description, and pickup location.');
      return;
    }

    if (!formData.image_url.trim()) {
      setError('Please manually upload a photo of your item so peers can inspect it.');
      return;
    }

    setLoading(true);
    try {
      const res = await resourceService.create(formData);
      if (res.data.success) {
        navigate('/my-resources');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 mb-2">
          <Sparkles className="size-3 text-indigo-600" />
          Campus Resource Exchange
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight sm:text-4xl">
          List a Resource for Classmates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share your study equipment, textbooks, or tools with fellow students when you're not using them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          
          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-700">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="size-3.5 text-indigo-600" />
                Resource Title / Item Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Casio FX-991EX ClassWiz Scientific Calculator"
                value={formData.resource_name}
                onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium placeholder:text-slate-400 transition"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Item Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  <option value="New">New (Unused / mint)</option>
                  <option value="Like New">Like New (Barely used)</option>
                  <option value="Good">Good (Minor wear, 100% working)</option>
                  <option value="Fair">Fair (Noticeable wear, functional)</option>
                </select>
              </div>
            </div>

            {/* Manual Image Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UploadCloud className="size-4 text-indigo-600" />
                  Upload Resource Photo *
                </span>
                <span className="text-[11px] text-slate-400 font-normal">JPG, PNG, WEBP (Max 5MB)</span>
              </label>

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="resource-photo-upload"
              />

              {!formData.image_url ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 transition cursor-pointer p-6 sm:p-8 text-center flex flex-col items-center justify-center group"
                >
                  <div className="size-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-indigo-100 dark:border-indigo-900 grid place-items-center mb-3 group-hover:scale-105 transition">
                    <Camera className="size-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to select a photo from your device
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Take a clear picture of your academic item so borrowers see its real condition.
                  </p>
                  <button
                    type="button"
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs group-hover:bg-indigo-700 transition"
                  >
                    <UploadCloud className="size-3.5" />
                    Browse Photos
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative size-24 sm:size-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-white">
                    <img
                      src={formData.image_url}
                      alt="Uploaded preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold mb-1">
                      <CheckCircle className="size-3" />
                      Photo Ready
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {fileName || 'Custom Item Photo'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ready to be displayed in the campus catalog.
                    </p>
                    <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <RefreshCw className="size-3" />
                        Replace Photo
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                      >
                        <Trash2 className="size-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Presets Accordion */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <span>{showPresets ? '▲ Hide campus presets' : '▼ Or pick a pre-made campus preset (optional)'}</span>
                </button>

                {showPresets && (
                  <div className="mt-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {imagePresets.map((preset) => {
                        const isSelected = formData.image_url === preset.url;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image_url: preset.url });
                              setImagePreview(preset.url);
                              setFileName(preset.label);
                            }}
                            className={`flex items-center gap-2 rounded-xl p-2 text-left border text-xs font-bold transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shadow-xs ring-2 ring-indigo-200'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="size-7 rounded-lg object-cover shrink-0" />
                            <span className="line-clamp-1 text-[11px]">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="url"
                      placeholder="Or paste an image link (e.g. https://...)"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 bg-white dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-indigo-600" />
                Pickup Location on Campus *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Central Library - 2nd Floor Study Tables"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {quickLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="size-3.5 text-indigo-600" />
                Item Description & Instructions *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Include model info, textbook edition, whether cables/accessories are included, and any special care instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 text-slate-900 font-medium transition"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Publishing Listing...
                  </span>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Publish Resource to Campus Catalog
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Sticky Live Card Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="size-3.5 text-indigo-600" />
              Live Catalog Preview
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Updates in real-time
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xl shadow-slate-200/50">
            {/* Card Preview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Camera className="size-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold text-slate-500">No Photo Uploaded Yet</p>
                    <p className="text-[10px] text-slate-400">Upload a photo to see live preview</p>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {formData.condition}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3">
                  <span className="rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-extrabold text-indigo-700 uppercase tracking-wide border border-white/60">
                    {currentCategory?.category_name || 'Category'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0 (New)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">Free to Borrow</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                  {formData.resource_name || 'Your Resource Title Will Appear Here'}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{formData.location || 'Location will show here'}</span>
                </p>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {formData.description || 'Your description snippet will appear here for peers to read before requesting.'}
                </p>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {user?.name || 'You (Lender)'}
                    </span>
                  </div>
                  <span className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">
                    Borrow
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
