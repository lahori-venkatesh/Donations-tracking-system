const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public analytics
router.get('/public/stats', analyticsController.getPublicStats);
router.get('/public/trends', analyticsController.getPublicTrends);

// Protected routes
router.use(protect);

// Donor analytics
router.get('/donor/dashboard', authorize('donor'), analyticsController.getDonorAnalytics);
router.get('/donor/impact', authorize('donor'), analyticsController.getDonorImpact);

// NGO analytics
router.get('/ngo/dashboard', authorize('ngo'), analyticsController.getNGOAnalytics);
router.get('/ngo/projects/:projectId/analytics', authorize('ngo'), analyticsController.getProjectAnalytics);

// Admin analytics
router.get('/admin/overview', authorize('admin'), analyticsController.getAdminOverview);
router.get('/admin/fraud-detection', authorize('admin'), analyticsController.getFraudAnalytics);
router.get('/admin/verification-stats', authorize('admin'), analyticsController.getVerificationStats);

module.exports = router;