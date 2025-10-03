const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication and admin role requirement to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', adminController.getAnalytics);
router.get('/platform-stats', adminController.getPlatformStats);
router.get('/fraud-analytics', adminController.getFraudAnalytics);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:userId', adminController.updateUser);
router.put('/users/:userId/status', adminController.manageUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// NGO and project management
router.put('/verify-ngo/:ngoId', adminController.verifyNGO);
router.put('/projects/:projectId/status', adminController.manageProjectStatus);
router.get('/verification-queue', adminController.getVerificationQueue);

// Reports
router.get('/reports', adminController.getReports);
router.get('/reports/export/:type', adminController.exportReport);

// System settings (placeholder for future implementation)
router.get('/settings', (req, res) => {
  res.json({
    general: {
      platformName: 'DonateTrack',
      platformDescription: 'Transparent donation platform',
      maintenanceMode: false,
      registrationEnabled: true,
      contactEmail: 'admin@donatetrack.com'
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: false
    },
    donations: {
      minDonationAmount: 1,
      maxDonationAmount: 10000,
      defaultCurrency: 'USD',
      taxDeductibleThreshold: 250,
      processingFee: 2.9
    },
    verification: {
      autoApproveSmallDonations: true,
      smallDonationThreshold: 100,
      requireDocumentVerification: true,
      verificationTimeout: 7
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      donorReceipts: true
    },
    fraud: {
      riskScoreThreshold: 75,
      autoFlagHighRisk: true,
      ipTrackingEnabled: true,
      deviceFingerprintingEnabled: true,
      maxDailyDonations: 5
    }
  });
});

router.put('/settings', (req, res) => {
  // In a real implementation, this would save settings to database
  res.json({ message: 'Settings saved successfully' });
});

// Notifications endpoint
router.get('/notifications', (req, res) => {
  // Mock notifications data
  res.json({
    notifications: [
      {
        id: 1,
        type: 'verification',
        message: 'New NGO verification pending',
        timestamp: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'fraud',
        message: 'High-risk donation flagged',
        timestamp: new Date(),
        read: false
      }
    ],
    unreadCount: 2
  });
});

module.exports = router;