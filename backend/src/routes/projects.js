const express = require('express');
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);

// Protected routes
router.use(protect);
router.post('/:id/donate', projectController.donateToProject);

module.exports = router;