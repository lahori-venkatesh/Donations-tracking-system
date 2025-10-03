const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const donorRoutes = require('./donor');
const ngoRoutes = require('./ngo');
const adminRoutes = require('./admin');
const projectRoutes = require('./projects');

// Mount routes
router.use('/auth', authRoutes);
router.use('/donor', donorRoutes);
router.use('/ngo', ngoRoutes);
router.use('/admin', adminRoutes);
router.use('/projects', projectRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'DonateTrack API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      donor: '/api/donor',
      ngo: '/api/ngo',
      admin: '/api/admin',
      projects: '/api/projects'
    }
  });
});

module.exports = router;