// User roles
export const USER_ROLES = {
  DONOR: 'donor',
  NGO: 'ngo',
  ADMIN: 'admin',
};

// Donation categories
export const DONATION_CATEGORIES = {
  FOOD: 'food',
  EDUCATION: 'education',
  MEDICAL: 'medical',
  EMERGENCY: 'emergency',
  SHELTER: 'shelter',
  WATER: 'water',
};

// Project status
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

// Donation status
export const DONATION_STATUS = {
  PENDING: 'pending',
  ALLOCATED: 'allocated',
  USED: 'used',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  DONOR: {
    DASHBOARD: '/api/donor/dashboard',
    DONATIONS: '/api/donor/donations',
    IMPACT: '/api/donor/impact',
    NOTIFICATIONS: '/api/donor/notifications',
  },
  NGO: {
    DASHBOARD: '/api/ngo/dashboard',
    PROJECTS: '/api/ngo/projects',
    PROOF_UPLOAD: '/api/ngo/proof-upload',
    BENEFICIARIES: '/api/ngo/beneficiaries',
  },
  ADMIN: {
    ANALYTICS: '/api/admin/analytics',
    USERS: '/api/admin/users',
    REPORTS: '/api/admin/reports',
  },
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#22c55e',
  ACCENT: '#d946ef',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280',
};

// File upload settings
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
};