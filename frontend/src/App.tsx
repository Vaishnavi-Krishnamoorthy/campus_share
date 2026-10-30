import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ChatProvider } from './context/ChatContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ChatModal } from './components/ChatModal.js';

import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { BrowseResourcesPage } from './pages/BrowseResourcesPage.js';
import { ResourceDetailPage } from './pages/ResourceDetailPage.js';
import { AddResourcePage } from './pages/AddResourcePage.js';
import { MyResourcesPage } from './pages/MyResourcesPage.js';
import { BorrowedItemsPage } from './pages/BorrowedItemsPage.js';
import { MyRequestsPage } from './pages/MyRequestsPage.js';
import { LendingRequestsPage } from './pages/LendingRequestsPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI Boundary captured an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-1.5">Something went wrong</h2>
            <p className="text-xs text-slate-500 mb-5">There was a temporary rendering issue with this view.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              Reload View
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <Navbar />
                <main className="flex-1 page-transition">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/browse" element={<BrowseResourcesPage />} />
                    <Route path="/resources/:id" element={<ResourceDetailPage />} />

                    {/* Protected Student Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/add-resource" element={<ProtectedRoute><AddResourcePage /></ProtectedRoute>} />
                    <Route path="/my-resources" element={<ProtectedRoute><MyResourcesPage /></ProtectedRoute>} />
                    <Route path="/borrowed" element={<ProtectedRoute><BorrowedItemsPage /></ProtectedRoute>} />
                    <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
                    <Route path="/lending-requests" element={<ProtectedRoute><LendingRequestsPage /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Admin Route */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
                <ChatModal />
              </div>
            </BrowserRouter>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
