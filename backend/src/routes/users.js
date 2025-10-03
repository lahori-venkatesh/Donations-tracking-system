const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Protected routes
router.use(protect);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().matches(/^[6-9]\d{9}$/),
  body('panNumber').optional().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
], validate, userController.updateProfile);

router.post('/avatar', upload.upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// NGO specific routes
router.put('/ngo-profile', authorize('ngo'), [
  body('organizationName').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('website').optional().isURL(),
  body('establishedYear').optional().isInt({ min: 1800, max: new Date().getFullYear() })
], validate, userController.updateNGOProfile);

// Donor specific routes
router.get('/donor/dashboard', authorize('donor'), userController.getDonorDashboard);
router.put('/donor/preferences', authorize('donor'), userController.updateDonorPreferences);

// NGO dashboard
router.get('/ngo/dashboard', authorize('ngo'), userController.getNGODashboard);

// Admin routes
router.get('/admin/users', authorize('admin'), userController.getAllUsers);
router.put('/admin/users/:id/status', authorize('admin'), userController.updateUserStatus);

module.exports = router;