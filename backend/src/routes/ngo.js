const express = require('express');
const multer = require('multer');
const ngoController = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes are protected and for NGOs only
router.use(protect);
router.use(authorize('ngo'));

// Dashboard and projects
router.get('/dashboard', ngoController.getDashboard);
router.get('/projects', ngoController.getProjects);
router.post('/projects', ngoController.createProject);
router.put('/projects/:projectId', ngoController.updateProject);
router.delete('/projects/:projectId', ngoController.deleteProject);

// Proof uploads
router.post('/proof-upload', upload.single('file'), ngoController.uploadProof);

// Beneficiaries
router.get('/beneficiaries', ngoController.getBeneficiaries);
router.post('/beneficiaries', ngoController.createBeneficiary);
router.put('/beneficiaries/:id', ngoController.updateBeneficiary);
router.delete('/beneficiaries/:id', ngoController.deleteBeneficiary);

module.exports = router;