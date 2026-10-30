import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceService, categoryService } from '../services/api.js';
import { Resource, Category } from '../types/index.js';
import { ResourceCard } from '../components/ResourceCard.js';
import { Search, Filter, RotateCcw, PackageSearch, SlidersHorizontal, Sparkles, X, Check } from 'lucide-react';

export const BrowseResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.data.success) {
          setCategories(res.data.categories || res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered resources from backend API
  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCondition) params.condition = selectedCondition;
      if (selectedAvailability) params.availability = selectedAvailability;
      if (selectedDepartment) params.department = selectedDepartment;
      if (sortBy) params.sort = sortBy;

      let res;
      if (searchTerm.trim()) {
        res = await resourceService.search(searchTerm.trim(), params);
      } else {
        res = await resourceService.getAll(params);
      }

      if (res.data.success) {
        setResources(res.data.resources || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to query resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedCondition, selectedAvailability, selectedDepartment, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
    fetchResources();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedAvailability('');
    setSelectedDepartment('');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || selectedCondition || selectedAvailability || selectedDepartment
  );

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 mb-2">
          <Sparkles className="size-3 text-indigo-600" />
          Campus Resource Inventory
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight sm:text-4xl">
              Browse Campus Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore available calculators, course textbooks, tools, and lab gear across campus departments.
            </p>
          </div>
          
          <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs shrink-0 self-start sm:self-auto">
            <span className="text-indigo-600 font-extrabold text-sm">{resources.length}</span> items listed
          </div>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="mb-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5 animate-slide-up">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, course code, author, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100/60 placeholder:text-slate-400 text-slate-900 font-medium transition"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition"
          >
            Search Gear
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 ${
              selectedCategory === ''
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.category_id}
              onClick={() => setSelectedCategory(selectedCategory === c.category_name ? '' : c.category_name)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 ${
                selectedCategory === c.category_name
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {c.category_name}
            </button>
          ))}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Condition */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Any Condition</option>
              <option value="New">New (Mint)</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good (Functional)</option>
              <option value="Fair">Fair (Noticeable wear)</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="BORROWED">Currently Borrowed</option>
              <option value="PENDING">Pending Approval</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Active Filter Chips & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400">Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {selectedCategory}
                <X className="size-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedCondition && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {selectedCondition}
                <X className="size-3 cursor-pointer" onClick={() => setSelectedCondition('')} />
              </span>
            )}
            {selectedAvailability && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {selectedAvailability}
                <X className="size-3 cursor-pointer" onClick={() => setSelectedAvailability('')} />
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {selectedDepartment}
                <X className="size-3 cursor-pointer" onClick={() => setSelectedDepartment('')} />
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto transition"
            >
              <RotateCcw className="size-3" />
              Reset All
            </button>
          </div>
        )}

      </div>

      {/* Catalog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-14 text-center shadow-xs">
          <PackageSearch className="size-14 text-slate-300 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-slate-900 font-display">No resources match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting different categories, or clearing active filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <RotateCcw className="size-3.5" />
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.resource_id} resource={resource} />
          ))}
        </div>
      )}

    </div>
  );
};
