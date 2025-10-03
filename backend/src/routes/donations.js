const express = require('express');
const { body, query } = require('express-validator');
const donationController = require('../controllers/donationController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const createDonationValidation = [
  body('project')
    .isMongoId()
    .withMessage('Please provide a valid project ID'),
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Donation amount must be at least ₹1'),
  body('paymentMethod')
    .isIn(['razorpay', 'bank_transfer', 'upi', 'card', 'wallet'])
    .withMessage('Please select a valid payment method'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot be more than 500 characters')
];

// Public routes
router.get('/stats', donationController.getDonationStats);

// Protected routes
router.use(protect);

// Donor routes
router.get('/my-donations', authorize('donor'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'refunded'])
], validate, donationController.getMyDonations);

router.post('/', authorize('donor'), createDonationValidation, validate, donationController.createDonation);
router.post('/verify-payment', authorize('donor'), donationController.verifyPayment);
router.get('/:id', donationController.getDonation);
router.get('/:id/receipt', donationController.getReceipt);
router.get('/:id/tax-certificate', donationController.getTaxCertificate);
router.post('/:id/refund-request', authorize('donor'), [
  body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters')
], validate, donationController.requestRefund);

// NGO routes
router.get('/ngo/received', authorize('ngo'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], validate, donationController.getReceivedDonations);

// Admin routes
router.get('/admin/all', authorize('admin'), donationController.getAllDonations);
router.put('/:id/verify', authorize('admin'), donationController.verifyDonation);
router.put('/:id/refund', authorize('admin'), donationController.processRefund);

module.exports = router;