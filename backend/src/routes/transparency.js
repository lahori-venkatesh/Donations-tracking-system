const express = require('express');
const { body } = require('express-validator');
const transparencyController = require('../controllers/transparencyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/project/:projectId', optionalAuth, transparencyController.getProjectTransparency);

// Protected routes
router.use(protect);

// NGO routes for updating transparency
router.post('/project/:projectId/progress', authorize('ngo'), [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('description').trim().isLength({ min: 20, max: 1000 }),
  body('completionPercentage').optional().isFloat({ min: 0, max: 100 })
], validate, upload.upload.array('images', 5), transparencyController.addProgressUpdate);

router.post('/project/:projectId/fund-utilization', authorize('ngo'), [
  body('category').trim().notEmpty(),
  body('amount').isNumeric().isFloat({ min: 0 }),
  body('description').trim().isLength({ min: 10, max: 500 })
], validate, upload.upload.array('receipts', 3), transparencyController.addFundUtilization);

router.post('/project/:projectId/impact-metrics', authorize('ngo'), [
  body('metric').trim().notEmpty(),
  body('value').isNumeric(),
  body('unit').trim().notEmpty()
], validate, transparencyController.addImpactMetric);

// Admin verification routes
router.put('/verify/:updateId', authorize('admin'), transparencyController.verifyUpdate);

module.exports = router;