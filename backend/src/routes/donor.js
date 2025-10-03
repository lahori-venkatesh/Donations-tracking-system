const express = require('express');
const donorController = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and for donors only
router.use(protect);
router.use(authorize('donor'));

// Dashboard and stats
router.get('/dashboard', donorController.getDashboard);
router.get('/donations', donorController.getDonations);
router.get('/impact/:donationId', donorController.getDonationImpact);

// Notifications
router.get('/notifications', donorController.getNotifications);
router.put('/notifications/:notificationId/read', donorController.markNotificationRead);

// Donation creation
router.post('/donate', donorController.createDonation);

module.exports = router;