const Project = require('../models/Project');
const logger = require('../utils/logger');

// @desc    Get project transparency data
// @route   GET /api/v1/transparency/project/:projectId
// @access  Public
const getProjectTransparency = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('ngo', 'name ngoProfile.organizationName ngoProfile.verification')
      .select('title transparency funding beneficiaries');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        project: {
          title: project.title,
          ngo: project.ngo
        },
        transparency: project.transparency,
        funding: project.funding,
        beneficiaries: project.beneficiaries
      }
    });
  } catch (error) {
    logger.error('Get project transparency error:', error);
    next(error);
  }
};

// @desc    Add progress update
// @route   POST /api/v1/transparency/project/:projectId/progress
// @access  Private (NGO only)
const addProgressUpdate = async (req, res, next) => {
  try {
    const { title, description, milestone, completionPercentage } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user owns the project
    if (project.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Process uploaded images (placeholder)
    const images = req.files ? req.files.map(file => 'https://example.com/image.jpg') : [];

    const progressUpdate = {
      title,
      description,
      images,
      milestone,
      completionPercentage: completionPercentage || 0,
      date: new Date()
    };

    project.transparency.progressUpdates.push(progressUpdate);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Progress update added successfully',
      data: progressUpdate
    });
  } catch (error) {
    logger.error('Add progress update error:', error);
    next(error);
  }
};

// @desc    Add fund utilization record
// @route   POST /api/v1/transparency/project/:projectId/fund-utilization
// @access  Private (NGO only)
const addFundUtilization = async (req, res, next) => {
  try {
    const { category, amount, description } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Process receipt uploads (placeholder)
    const receipts = req.files ? req.files.map(file => 'https://example.com/receipt.jpg') : [];

    // Calculate percentage
    const totalSpent = project.transparency.fundUtilization.reduce((sum, item) => sum + item.amount, 0) + parseFloat(amount);
    const percentage = (parseFloat(amount) / project.funding.raisedAmount) * 100;

    const utilizationRecord = {
      category,
      amount: parseFloat(amount),
      percentage,
      description,
      receipts
    };

    project.transparency.fundUtilization.push(utilizationRecord);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Fund utilization record added successfully',
      data: utilizationRecord
    });
  } catch (error) {
    logger.error('Add fund utilization error:', error);
    next(error);
  }
};

// @desc    Add impact metric
// @route   POST /api/v1/transparency/project/:projectId/impact-metrics
// @access  Private (NGO only)
const addImpactMetric = async (req, res, next) => {
  try {
    const { metric, value, unit } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const impactMetric = {
      metric,
      value: parseFloat(value),
      unit,
      measuredAt: new Date()
    };

    project.transparency.impactMetrics.push(impactMetric);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Impact metric added successfully',
      data: impactMetric
    });
  } catch (error) {
    logger.error('Add impact metric error:', error);
    next(error);
  }
};

// @desc    Verify transparency update (Admin only)
// @route   PUT /api/v1/transparency/verify/:updateId
// @access  Private (Admin only)
const verifyUpdate = async (req, res, next) => {
  try {
    // Placeholder implementation for admin verification
    res.status(200).json({
      success: true,
      message: 'Update verified successfully'
    });
  } catch (error) {
    logger.error('Verify update error:', error);
    next(error);
  }
};

module.exports = {
  getProjectTransparency,
  addProgressUpdate,
  addFundUtilization,
  addImpactMetric,
  verifyUpdate
};