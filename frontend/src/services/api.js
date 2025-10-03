import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Donor API
export const donorAPI = {
  getDashboard: () => api.get('/donor/dashboard'),
  getDonations: (params) => api.get('/donor/donations', { params }),
  getDonationImpact: (donationId) => api.get(`/donor/impact/${donationId}`),
  getNotifications: () => api.get('/donor/notifications'),
  markNotificationRead: (notificationId) => 
    api.put(`/donor/notifications/${notificationId}/read`),
};

// NGO API
export const ngoAPI = {
  getDashboard: () => api.get('/ngo/dashboard'),
  getProjects: (params) => api.get('/ngo/projects', { params }),
  createProject: (projectData) => api.post('/ngo/projects', projectData),
  updateProject: (projectId, data) => api.put(`/ngo/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/ngo/projects/${projectId}`),
  uploadProof: (formData) => api.post('/ngo/proof-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getBeneficiaries: (params) => api.get('/ngo/beneficiaries', { params }),
  createBeneficiary: (data) => api.post('/ngo/beneficiaries', data),
  updateBeneficiary: (id, data) => api.put(`/ngo/beneficiaries/${id}`, data),
  deleteBeneficiary: (id) => api.delete(`/ngo/beneficiaries/${id}`),
};

// Admin API
export const adminAPI = {
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getReports: (params) => api.get('/admin/reports', { params }),
  exportReport: (type, params) => api.get(`/admin/reports/export/${type}`, {
    params,
    responseType: 'blob',
  }),
};

export default api;