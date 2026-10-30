import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api.js';
import {
  ShieldCheck,
  BarChart3,
  Users,
  Package,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'ANALYTICS' | 'STUDENTS'>('REPORTS');
  const [loading, setLoading] = useState(true);

  // Reports data
  const [mostBorrowed, setMostBorrowed] = useState<any[]>([]);
  const [categoriesReport, setCategoriesReport] = useState<any[]>([]);
  const [overdueReport, setOverdueReport] = useState<any[]>([]);

  // Analytics & Audit state
  const [selectedDemoQuery, setSelectedDemoQuery] = useState('JOIN_FOUR_TABLES');
  const [demoQueryResult, setDemoQueryResult] = useState<any>(null);
  const [executingQuery, setExecutingQuery] = useState(false);

  // Students list
  const [students, setStudents] = useState<any[]>([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, mostBorrowedRes, catRes, overdueRes, studentsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getMostBorrowedReport(),
        adminService.getCategoryDistributionReport(),
        adminService.getOverdueReport(),
        adminService.getAllStudents(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats || statsRes.data.data);
      if (mostBorrowedRes.data.success) setMostBorrowed(mostBorrowedRes.data.data || mostBorrowedRes.data.resources || []);
      if (catRes.data.success) setCategoriesReport(catRes.data.data || catRes.data.categories || []);
      if (overdueRes.data.success) setOverdueReport(overdueRes.data.data || overdueRes.data.borrowings || []);
      if (studentsRes.data.success) setStudents(studentsRes.data.students || studentsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRunAnalytics = async () => {
    setExecutingQuery(true);
    try {
      const res = await adminService.executeDemoQuery(selectedDemoQuery);
      if (res.data.success) {
        setDemoQueryResult(res.data);
      }
    } catch (err) {
      console.error('Failed to execute analytics audit:', err);
    } finally {
      setExecutingQuery(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            <ShieldCheck className="size-3.5 text-indigo-600" />
            Campus Operations & Governance
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
            Platform Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time platform activity metrics, borrowing cycle tracking, and campus student directory.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="size-3.5" />
          Refresh Metrics
        </button>
      </div>

      {/* System KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Students</span>
          <p className="text-xl font-extrabold text-slate-900 font-display mt-1">{stats?.totalStudents || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Listed Resources</span>
          <p className="text-xl font-extrabold text-slate-900 font-display mt-1">{stats?.totalResources || 0}</p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600">Active Loans</span>
          <p className="text-xl font-extrabold text-indigo-700 font-display mt-1">{stats?.activeLoans || 0}</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-rose-600">Overdue Items</span>
          <p className="text-xl font-extrabold text-rose-700 font-display mt-1">{stats?.overdueLoans || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Categories</span>
          <p className="text-xl font-extrabold text-slate-900 font-display mt-1">{stats?.totalCategories || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Campus Rating</span>
          <p className="text-xl font-extrabold text-amber-600 font-display mt-1">★ {stats?.systemAvgRating || '5.0'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'REPORTS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="size-4" />
          Operational Reports
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'ANALYTICS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="size-4" />
          Platform Analytics & Audits
        </button>

        <button
          onClick={() => setActiveTab('STUDENTS')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'STUDENTS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="size-4" />
          Student Directory
        </button>
      </div>

      {/* TAB 1: OPERATIONAL REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Report 1: Most Borrowed Resources */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Most Circulated Resources Leaderboard</h3>
                <p className="text-xs text-slate-500">Top trending academic equipment and course materials by loan volume</p>
              </div>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full">
                High Circulation Rate
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Resource Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Student Owner</th>
                    <th className="px-4 py-3 text-right">Circulation Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mostBorrowed.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">{row.resource_name}</td>
                      <td className="px-4 py-3 text-slate-600">{row.category_name}</td>
                      <td className="px-4 py-3 text-slate-600">{row.owner_name}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-indigo-600">{row.borrow_count} loans completed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report 2: Category Resource Distribution */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inventory Distribution by Category</h3>
                <p className="text-xs text-slate-500">Live inventory and availability balance across academic categories</p>
              </div>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                Active Catalog Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoriesReport.map((cat, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="font-bold text-slate-900 text-sm block">{cat.category_name}</span>
                  <p className="text-2xl font-extrabold text-indigo-600 font-display mt-2">{cat.total_resources} items</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                    <span>Available: <strong>{cat.available_count || 0}</strong></span>
                    <span>Currently Lent: <strong>{cat.borrowed_count || 0}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report 3: Overdue Resource Monitor */}
          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-rose-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-rose-600" />
                  Overdue Loans Priority Monitor
                </h3>
                <p className="text-xs text-slate-500">Active loans that have passed scheduled return dates requiring follow-up</p>
              </div>
              <span className="text-[11px] font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200">
                Action Required
              </span>
            </div>

            {overdueReport.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">All campus loans are currently on schedule. Zero overdue items!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-rose-50 text-[11px] font-extrabold uppercase text-rose-800">
                    <tr>
                      <th className="px-4 py-3">Resource</th>
                      <th className="px-4 py-3">Borrower Details</th>
                      <th className="px-4 py-3">Scheduled Due Date</th>
                      <th className="px-4 py-3 text-right">Overdue Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100">
                    {overdueReport.map((row, idx) => (
                      <tr key={idx} className="hover:bg-rose-50/40">
                        <td className="px-4 py-3 font-bold text-slate-900">{row.resource_name}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.borrower_name}
                          <span className="text-slate-400 block text-[10px]">{row.borrower_email}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-rose-600">{new Date(row.due_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                            {row.days_overdue} days past due
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: PLATFORM ANALYTICS & AUDITS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Interactive Platform Insights & Audits
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Generate comprehensive multi-table operational reports across platform activity, loan lifecycles, and student engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={selectedDemoQuery}
                onChange={(e) => setSelectedDemoQuery(e.target.value)}
                className="flex-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none bg-white"
              >
                <option value="JOIN_FOUR_TABLES">
                  Full Lifecycle Loan Audit (Resource, Borrower & Owner Cross-Reference)
                </option>
                <option value="AGGREGATE_METRICS">
                  Loan Duration & Benchmark Metrics (Minimum, Maximum & Average Days)
                </option>
                <option value="STUDENT_LEADERBOARD">
                  Student Engagement & Contribution Leaderboard (Active Sharers & Trust)
                </option>
                <option value="AVG_RATING_PER_CATEGORY">
                  Category Quality & Satisfaction Index (Average Ratings & Review Counts)
                </option>
              </select>

              <button
                onClick={handleRunAnalytics}
                disabled={executingQuery}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition shrink-0"
              >
                <Play className="size-4 fill-white" />
                {executingQuery ? 'Generating Audit...' : 'Run Audit'}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {demoQueryResult && (
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Audit Scope</span>
                  <h4 className="text-sm font-bold text-slate-900">{demoQueryResult.description}</h4>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  {demoQueryResult.rows.length} records analyzed
                </span>
              </div>

              {/* Dynamic Table Output */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      {demoQueryResult.rows.length > 0 &&
                        Object.keys(demoQueryResult.rows[0]).map((col) => (
                          <th key={col} className="px-4 py-3">{col.replace(/_/g, ' ')}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {demoQueryResult.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        {Object.values(row).map((val: any, cIdx: number) => (
                          <td key={cIdx} className="px-4 py-2.5 font-medium">
                            {String(val !== null ? val : '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDENTS DIRECTORY */}
      {activeTab === 'STUDENTS' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-base font-bold text-slate-900">Student Directory & Activity Ledger</h3>
            <p className="text-xs text-slate-500">Verified campus students registered on the platform</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">ID Number</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3 text-center">Listed</th>
                  <th className="px-4 py-3 text-center">Borrowed</th>
                  <th className="px-4 py-3 text-center">Lent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((st) => (
                  <tr key={st.student_id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {st.name}
                      {st.role === 'ADMIN' && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-800">
                          ADMIN
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{st.student_number}</td>
                    <td className="px-4 py-3 text-slate-500">{st.email}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{st.department}</td>
                    <td className="px-4 py-3 text-slate-600">Year {st.year}</td>
                    <td className="px-4 py-3 text-center font-bold text-indigo-600">{st.resources_listed}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-600">{st.items_borrowed}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{st.items_lent}</td>
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
