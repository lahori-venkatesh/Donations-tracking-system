const Project = require('../models/Project');
const Donation = require('../models/Donation');
const Beneficiary = require('../models/Beneficiary');
const Proof = require('../models/Proof');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// @desc    Get NGO dashboard data
// @route   GET /api/ngo/dashboard
// @access  Private (NGO only)
const getDashboard = async (req, res, next) => {
  try {
    const ngoId = req.user.id;

    // Get projects statistics
    const projects = await Project.find({ ngoId });
    const projectStats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      totalTargetAmount: projects.reduce((sum, p) => sum + p.targetAmount, 0),
      totalRaisedAmount: projects.reduce((sum, p) => sum + p.currentAmount, 0)
    };

    // Get donations for NGO projects
    const projectIds = projects.map(p => p._id);
    const donations = await Donation.find({ projectId: { $in: projectIds } })
      .populate('donorId', 'name')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const donationStats = {
      total: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
      pending: donations.filter(d => d.status === 'pending').length,
      used: donations.filter(d => d.status === 'used').length
    };

    // Get beneficiaries count
    const beneficiariesCount = await Beneficiary.countDocuments({ 
      projectId: { $in: projectIds } 
    });

    res.status(200).json({
      success: true,
      data: {
        projectStats,
        donationStats,
        beneficiariesCount,
        recentDonations: donations
      }
    });
  } catch (error) {
    logger.error('Get NGO dashboard error:', error);
    next(error);
  }
};

// @desc    Get NGO projects
// @route   GET /api/ngo/projects
// @access  Private (NGO only)
const getProjects = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { ngoId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .populate('beneficiaries')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/ngo/projects
// @access  Private (NGO only)
const createProject = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const projectData = {
      ...req.body,
      ngoId
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    logger.error('Create project error:', error);
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/ngo/projects/:projectId
// @access  Private (NGO only)
const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const ngoId = req.user.id;

    const project = await Project.findOne({ _id: projectId, ngoId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    logger.error('Update project error:', error);
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/ngo/projects/:projectId
// @access  Private (NGO only)
const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const ngoId = req.user.id;

    const project = await Project.findOne({ _id: projectId, ngoId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project has donations
    const donationsCount = await Donation.countDocuments({ projectId });
    if (donationsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing donations'
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    logger.error('Delete project error:', error);
    next(error);
  }
};

// @desc    Upload proof
// @route   POST /api/ngo/proof-upload
// @access  Private (NGO only)
const uploadProof = async (req, res, next) => {
  try {
    const { projectId, donationIds, type, title, description } = req.body;
    const uploadedBy = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, ngoId: uploadedBy });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // For demo purposes, we'll use a mock file URL
    // In production, you would upload to Cloudinary or similar service
    const fileUrl = `https://example.com/uploads/${Date.now()}-${req.file.originalname}`;

    const proof = await Proof.create({
      projectId,
      donationIds: JSON.parse(donationIds || '[]'),
      type,
      title,
      description,
      fileUrl,
      uploadedBy,
      metadata: {
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname
      }
    });

    // Update project proofs array
    project.proofs.push(proof._id);
    await project.save();

    // Create notifications for donors
    if (donationIds) {
      const donationIdArray = JSON.parse(donationIds);
      const donations = await Donation.find({ _id: { $in: donationIdArray } });
      
      for (const donation of donations) {
        await Notification.create({
          userId: donation.donorId,
          type: 'proof_uploaded',
          title: 'New Proof Uploaded',
          message: `New proof has been uploaded for your donation to ${project.name}`,
          donationId: donation._id,
          projectId: project._id,
          proofId: proof._id
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Proof uploaded successfully',
      data: proof
    });
  } catch (error) {
    logger.error('Upload proof error:', error);
    next(error);
  }
};

// @desc    Get beneficiaries
// @route   GET /api/ngo/beneficiaries
// @access  Private (NGO only)
const getBeneficiaries = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get NGO's projects first
    const projects = await Project.find({ ngoId }).select('_id');
    const projectIds = projects.map(p => p._id);

    const filter = { projectId: { $in: projectIds } };
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    const beneficiaries = await Beneficiary.find(filter)
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Beneficiary.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: beneficiaries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get beneficiaries error:', error);
    next(error);
  }
};

// @desc    Create beneficiary
// @route   POST /api/ngo/beneficiaries
// @access  Private (NGO only)
const createBeneficiary = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const { projectId } = req.body;

    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, ngoId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const beneficiary = await Beneficiary.create(req.body);

    // Add beneficiary to project
    project.beneficiaries.push(beneficiary._id);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Beneficiary created successfully',
      data: beneficiary
    });
  } catch (error) {
    logger.error('Create beneficiary error:', error);
    next(error);
  }
};

// @desc    Update beneficiary
// @route   PUT /api/ngo/beneficiaries/:id
// @access  Private (NGO only)
const updateBeneficiary = async (req, res, next) => {
  try {
    const beneficiaryId = req.params.id;
    const ngoId = req.user.id;

    // Find beneficiary and verify ownership through project
    const beneficiary = await Beneficiary.findById(beneficiaryId).populate('projectId');
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    if (beneficiary.projectId.ngoId.toString() !== ngoId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this beneficiary'
      });
    }

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Beneficiary updated successfully',
      data: updatedBeneficiary
    });
  } catch (error) {
    logger.error('Update beneficiary error:', error);
    next(error);
  }
};

// @desc    Delete beneficiary
// @route   DELETE /api/ngo/beneficiaries/:id
// @access  Private (NGO only)
const deleteBeneficiary = async (req, res, next) => {
  try {
    const beneficiaryId = req.params.id;
    const ngoId = req.user.id;

    // Find beneficiary and verify ownership through project
    const beneficiary = await Beneficiary.findById(beneficiaryId).populate('projectId');
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    if (beneficiary.projectId.ngoId.toString() !== ngoId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this beneficiary'
      });
    }

    await Beneficiary.findByIdAndDelete(beneficiaryId);

    // Remove from project beneficiaries array
    await Project.findByIdAndUpdate(
      beneficiary.projectId._id,
      { $pull: { beneficiaries: beneficiaryId } }
    );

    res.status(200).json({
      success: true,
      message: 'Beneficiary deleted successfully'
    });
  } catch (error) {
    logger.error('Delete beneficiary error:', error);
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProof,
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary
};