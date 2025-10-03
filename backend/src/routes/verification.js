const express = require('express');
const { body } = require('express-validator');
const verificationController = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Protected routes
router.use(protect);

// NGO verification routes
router.post('/ngo/submit', authorize('ngo'), 
  upload.upload.fields([
    { name: 'ngoRegistration', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'certificate80G', maxCount: 1 },
    { name: 'auditReports', maxCount: 3 }
  ]), 
  verificationController.submitNGOVerification
);

router.get('/ngo/status', authorize('ngo'), verificationController.getNGOVerificationStatus);
router.put('/ngo/update-documents', authorize('ngo'), verificationController.updateNGODocuments);

// Admin verification routes
router.get('/admin/pending', authorize('admin'), verificationController.getPendingVerifications);
router.put('/admin/verify/:ngoId', authorize('admin'), [
  body('level').isIn(['basic', 'verified', 'premium', 'suspended']),
  body('notes').optional().trim().isLength({ max: 1000 })
], validate, verificationController.verifyNGO);

router.get('/admin/ngo/:ngoId', authorize('admin'), verificationController.getNGOVerificationDetails);

// Public verification check
router.get('/check/:ngoId', verificationController.checkNGOVerification);

module.exports = router;