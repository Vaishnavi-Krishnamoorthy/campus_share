import axios from 'axios';
import { handleMockRequest } from './mockBackend.js';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const hasExplicitBackend = Boolean((import.meta as any).env?.VITE_API_URL);

// If on Vercel without an explicit backend configured, avoid Mixed Content by using local cloud storage adapter
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (isLocalhost ? `http://${window.location.hostname}:5000/api` : '/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

// Attach Authorization Bearer token to all requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_share_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If on Vercel / Cloud preview and no live backend URL is provided, serve seamlessly from local cloud storage
  if (!hasExplicitBackend && !isLocalhost) {
    const mockRes = handleMockRequest(config);
    if (mockRes) {
      config.adapter = async () => mockRes;
    }
  }

  return config;
});

// Handle offline fallback & 401 unauthorized errors gracefully
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If Network Error occurs (e.g., backend down or unreachable), fallback to mock
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('network error');

    if (isNetworkError && error.config) {
      const mockRes = handleMockRequest(error.config);
      if (mockRes) {
        return mockRes;
      }
    }

    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('campus_share_token');
        localStorage.removeItem('campus_share_user');
      }
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (studentData: any) => api.post('/auth/register', studentData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const resourceService = {
  getAll: (params?: any) => api.get('/resources', { params }),
  search: (q: string, params?: any) => api.get('/resources/search', { params: { q, ...params } }),
  getById: (id: string | number) => api.get(`/resources/${id}`),
  getMyResources: () => api.get('/resources/my'),
  create: (data: any) => api.post('/resources', data),
  update: (id: string | number, data: any) => api.put(`/resources/${id}`, data),
  delete: (id: string | number) => api.delete(`/resources/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
};

export const requestService = {
  create: (data: any) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my'),
  getReceivedRequests: () => api.get('/requests/received'),
  approve: (id: string | number) => api.put(`/requests/${id}/approve`),
  reject: (id: string | number) => api.put(`/requests/${id}/reject`),
  cancel: (id: string | number) => api.put(`/requests/${id}/cancel`),
};

export const borrowingService = {
  getBorrowed: () => api.get('/borrowings/borrowed'),
  getLent: () => api.get('/borrowings/lent'),
  returnResource: (id: string | number) => api.put(`/borrowings/${id}/return`),
};

export const reviewService = {
  create: (data: { borrowing_id: number; rating: number; comment?: string }) =>
    api.post('/reviews', data),
  getResourceReviews: (resourceId: string | number) =>
    api.get(`/reviews/resource/${resourceId}`),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string | number) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getMostBorrowedReport: () => api.get('/admin/reports/most-borrowed'),
  getCategoryDistributionReport: () => api.get('/admin/reports/category-summary'),
  getOverdueReport: () => api.get('/admin/reports/overdue'),
  executeDemoQuery: (query_type: string) => api.post('/admin/demo-query', { query_type }),
  getAllStudents: () => api.get('/admin/students'),
  getAllBorrowings: (params?: any) => api.get('/admin/borrowings', { params }),
  getAllRequests: () => api.get('/admin/requests'),
};
