import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
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
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

// Donor API
export const donorAPI = {
  getDashboard: () => api.get('/api/donor/dashboard'),
  getDonations: (params) => api.get('/api/donor/donations', { params }),
  getDonationImpact: (donationId) => api.get(`/api/donor/impact/${donationId}`),
  getNotifications: () => api.get('/api/donor/notifications'),
  markNotificationRead: (notificationId) => 
    api.put(`/api/donor/notifications/${notificationId}/read`),
};

// NGO API
export const ngoAPI = {
  getDashboard: () => api.get('/api/ngo/dashboard'),
  getProjects: (params) => api.get('/api/ngo/projects', { params }),
  createProject: (projectData) => api.post('/api/ngo/projects', projectData),
  updateProject: (projectId, data) => api.put(`/api/ngo/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/api/ngo/projects/${projectId}`),
  uploadProof: (formData) => api.post('/api/ngo/proof-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getBeneficiaries: (params) => api.get('/api/ngo/beneficiaries', { params }),
  createBeneficiary: (data) => api.post('/api/ngo/beneficiaries', data),
  updateBeneficiary: (id, data) => api.put(`/api/ngo/beneficiaries/${id}`, data),
  deleteBeneficiary: (id) => api.delete(`/api/ngo/beneficiaries/${id}`),
};

// Admin API
export const adminAPI = {
  getAnalytics: (params) => api.get('/api/admin/analytics', { params }),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUser: (userId, data) => api.put(`/api/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  getReports: (params) => api.get('/api/admin/reports', { params }),
  exportReport: (type, params) => api.get(`/api/admin/reports/export/${type}`, {
    params,
    responseType: 'blob',
  }),
};

export default api;