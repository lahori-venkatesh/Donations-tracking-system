const User = require('../models/User');
const logger = require('../utils/logger');
const cloudinary = require('../utils/cloudinary');

// @desc    Submit NGO verification documents
// @route   POST /api/v1/verification/ngo/submit
// @access  Private (NGO only)
const submitNGOVerification = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload required documents'
      });
    }

    const user = await User.findById(ngoId);
    
    // Process uploaded documents (placeholder - implement actual file upload)
    const documents = {};
    
    if (files.ngoRegistration) {
      documents.ngoRegistration = {
        url: 'https://example.com/doc1.pdf',
        verified: false,
        uploadedAt: new Date()
      };
    }

    if (files.panCard) {
      documents.panCard = {
        url: 'https://example.com/doc2.pdf',
        verified: false,
        uploadedAt: new Date()
      };
    }

    if (files.certificate80G) {
      documents.certificate80G = {
        url: 'https://example.com/doc3.pdf',
        verified: false,
        uploadedAt: new Date()
      };
    }

    // Update user verification documents
    user.ngoProfile.verification.documents = {
      ...user.ngoProfile.verification.documents,
      ...documents
    };
    
    user.ngoProfile.verification.level = 'basic';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Verification documents submitted successfully',
      data: user.ngoProfile.verification
    });
  } catch (error) {
    logger.error('Submit NGO verification error:', error);
    next(error);
  }
};

// @desc    Get NGO verification status
// @route   GET /api/v1/verification/ngo/status
// @access  Private (NGO only)
const getNGOVerificationStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user.ngoProfile.verification
    });
  } catch (error) {
    logger.error('Get NGO verification status error:', error);
    next(error);
  }
};

// @desc    Get pending verifications (Admin only)
// @route   GET /api/v1/verification/admin/pending
// @access  Private (Admin only)
const getPendingVerifications = async (req, res, next) => {
  try {
    const pendingNGOs = await User.find({
      role: 'ngo',
      'ngoProfile.verification.level': { $in: ['unverified', 'basic'] }
    }).select('name email ngoProfile createdAt');

    res.status(200).json({
      success: true,
      data: pendingNGOs
    });
  } catch (error) {
    logger.error('Get pending verifications error:', error);
    next(error);
  }
};

// @desc    Verify NGO (Admin only)
// @route   PUT /api/v1/verification/admin/verify/:ngoId
// @access  Private (Admin only)
const verifyNGO = async (req, res, next) => {
  try {
    const { level, notes } = req.body;
    const ngoId = req.params.ngoId;

    const user = await User.findById(ngoId);
    
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // Update verification level
    user.ngoProfile.verification.level = level;
    user.ngoProfile.verification.verifiedAt = new Date();
    user.ngoProfile.verification.notes = notes;

    // Calculate compliance score based on verification level
    switch (level) {
      case 'verified':
        user.ngoProfile.verification.complianceScore = 75;
        break;
      case 'premium':
        user.ngoProfile.verification.complianceScore = 95;
        break;
      case 'suspended':
        user.ngoProfile.verification.complianceScore = 0;
        break;
      default:
        user.ngoProfile.verification.complianceScore = 50;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'NGO verification updated successfully',
      data: user.ngoProfile.verification
    });
  } catch (error) {
    logger.error('Verify NGO error:', error);
    next(error);
  }
};

// @desc    Get NGO verification details (Admin only)
// @route   GET /api/v1/verification/admin/ngo/:ngoId
// @access  Private (Admin only)
const getNGOVerificationDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.ngoId);
    
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ngo: user,
        verification: user.ngoProfile.verification
      }
    });
  } catch (error) {
    logger.error('Get NGO verification details error:', error);
    next(error);
  }
};

// @desc    Check NGO verification (Public)
// @route   GET /api/v1/verification/check/:ngoId
// @access  Public
const checkNGOVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.ngoId)
      .select('name ngoProfile.organizationName ngoProfile.verification.level ngoProfile.verification.verifiedAt ngoProfile.verification.badges');
    
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        organizationName: user.ngoProfile?.organizationName,
        verificationLevel: user.ngoProfile?.verification?.level || 'unverified',
        verifiedAt: user.ngoProfile?.verification?.verifiedAt,
        badges: user.ngoProfile?.verification?.badges || []
      }
    });
  } catch (error) {
    logger.error('Check NGO verification error:', error);
    next(error);
  }
};

// @desc    Update NGO documents
// @route   PUT /api/v1/verification/ngo/update-documents
// @access  Private (NGO only)
const updateNGODocuments = async (req, res, next) => {
  try {
    // Placeholder implementation
    res.status(200).json({
      success: true,
      message: 'Documents updated successfully'
    });
  } catch (error) {
    logger.error('Update NGO documents error:', error);
    next(error);
  }
};

module.exports = {
  submitNGOVerification,
  getNGOVerificationStatus,
  updateNGODocuments,
  getPendingVerifications,
  verifyNGO,
  getNGOVerificationDetails,
  checkNGOVerification
};