const User = require('../models/User');
const Project = require('../models/Project');
const Donation = require('../models/Donation');
const logger = require('../utils/logger');
const cloudinary = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = ['name', 'phone', 'panNumber'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/v1/users/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload to cloudinary (placeholder implementation)
    const avatarUrl = `https://via.placeholder.com/200x200?text=${encodeURIComponent(req.user.name)}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar: avatarUrl }
    });
  } catch (error) {
    logger.error('Upload avatar error:', error);
    next(error);
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/v1/users/avatar
// @access  Private
const deleteAvatar = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { avatar: null },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    logger.error('Delete avatar error:', error);
    next(error);
  }
};

// @desc    Update NGO profile
// @route   PUT /api/v1/users/ngo-profile
// @access  Private (NGO only)
const updateNGOProfile = async (req, res, next) => {
  try {
    const updateFields = {};
    const allowedFields = [
      'organizationName', 'description', 'website', 'establishedYear',
      'categories', 'address'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[`ngoProfile.${field}`] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'NGO profile updated successfully',
      data: user.ngoProfile
    });
  } catch (error) {
    logger.error('Update NGO profile error:', error);
    next(error);
  }
};

// @desc    Get donor dashboard
// @route   GET /api/v1/users/donor/dashboard
// @access  Private (Donor only)
const getDonorDashboard = async (req, res, next) => {
  try {
    const donorId = req.user.id;

    // Get donation statistics
    const donationStats = await Donation.getDonationStats({ 
      donor: donorId, 
      status: 'completed' 
    });

    // Get recent donations
    const recentDonations = await Donation.find({ 
      donor: donorId, 
      status: 'completed' 
    })
      .populate('project', 'title images ngo')
      .populate({
        path: 'project',
        populate: {
          path: 'ngo',
          select: 'name ngoProfile.organizationName'
        }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get impact metrics
    const impactProjects = await Project.find({
      donations: { $in: await Donation.find({ donor: donorId, status: 'completed' }).distinct('_id') }
    }).select('title transparency.impactMetrics beneficiaries');

    // Calculate total impact
    let totalBeneficiaries = 0;
    const impactMetrics = {};

    impactProjects.forEach(project => {
      totalBeneficiaries += project.beneficiaries?.currentCount || 0;
      
      project.transparency?.impactMetrics?.forEach(metric => {
        if (!impactMetrics[metric.metric]) {
          impactMetrics[metric.metric] = { value: 0, unit: metric.unit };
        }
        impactMetrics[metric.metric].value += metric.value;
      });
    });

    // Get user badges and achievements
    const user = await User.findById(donorId);
    const badges = user.donorProfile?.badges || [];

    res.status(200).json({
      success: true,
      data: {
        stats: donationStats,
        recentDonations,
        impact: {
          totalBeneficiaries,
          metrics: impactMetrics,
          projectsSupported: impactProjects.length
        },
        badges,
        profile: user.donorProfile
      }
    });
  } catch (error) {
    logger.error('Get donor dashboard error:', error);
    next(error);
  }
};

// @desc    Update donor preferences
// @route   PUT /api/v1/users/donor/preferences
// @access  Private (Donor only)
const updateDonorPreferences = async (req, res, next) => {
  try {
    const { categories, locations, notifications } = req.body;

    const updateFields = {};
    if (categories) updateFields['donorProfile.preferences.categories'] = categories;
    if (locations) updateFields['donorProfile.preferences.locations'] = locations;
    if (notifications) updateFields['donorProfile.preferences.notifications'] = notifications;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.donorProfile.preferences
    });
  } catch (error) {
    logger.error('Update donor preferences error:', error);
    next(error);
  }
};

// @desc    Get NGO dashboard
// @route   GET /api/v1/users/ngo/dashboard
// @access  Private (NGO only)
const getNGODashboard = async (req, res, next) => {
  try {
    const ngoId = req.user.id;

    // Get NGO projects
    const projects = await Project.find({ ngo: ngoId })
      .sort({ createdAt: -1 });

    // Get donation statistics for NGO projects
    const projectIds = projects.map(p => p._id);
    const donationStats = await Donation.getDonationStats({
      project: { $in: projectIds },
      status: 'completed'
    });

    // Get recent donations
    const recentDonations = await Donation.find({
      project: { $in: projectIds },
      status: 'completed'
    })
      .populate('donor', 'name avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate project statistics
    const projectStats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      funded: projects.filter(p => p.status === 'funded').length,
      completed: projects.filter(p => p.status === 'completed').length
    };

    // Get verification status
    const user = await User.findById(ngoId);
    const verificationStatus = user.ngoProfile?.verification || {};

    res.status(200).json({
      success: true,
      data: {
        projects: projects.slice(0, 5), // Recent 5 projects
        projectStats,
        donationStats,
        recentDonations,
        verificationStatus,
        profile: user.ngoProfile
      }
    });
  } catch (error) {
    logger.error('Get NGO dashboard error:', error);
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/v1/users/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  updateNGOProfile,
  getDonorDashboard,
  updateDonorPreferences,
  getNGODashboard,
  getAllUsers,
  updateUserStatus
};