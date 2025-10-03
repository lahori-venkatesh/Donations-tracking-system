const Donation = require('../models/Donation');
const Project = require('../models/Project');
const Beneficiary = require('../models/Beneficiary');
const Proof = require('../models/Proof');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// @desc    Get donor dashboard data
// @route   GET /api/donor/dashboard
// @access  Private (Donor only)
const getDashboard = async (req, res, next) => {
  try {
    const donorId = req.user.id;

    // Get donation statistics
    const donations = await Donation.find({ donorId }).populate('projectId', 'name');
    
    const stats = {
      totalDonated: donations.reduce((sum, d) => sum + d.amount, 0),
      donationCount: donations.length,
      projectsSupported: new Set(donations.map(d => d.projectId.toString())).size,
      livesImpacted: 0 // Will calculate based on beneficiaries
    };

    // Calculate lives impacted
    const projectIds = [...new Set(donations.map(d => d.projectId.toString()))];
    const beneficiaries = await Beneficiary.find({ projectId: { $in: projectIds } });
    stats.livesImpacted = beneficiaries.length;

    // Get recent donations with project details
    const recentDonations = await Donation.find({ donorId })
      .populate('projectId', 'name location')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent notifications
    const notifications = await Notification.find({ userId: donorId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentDonations,
        notifications
      }
    });
  } catch (error) {
    logger.error('Get donor dashboard error:', error);
    next(error);
  }
};

// @desc    Get donor donations with pagination
// @route   GET /api/donor/donations
// @access  Private (Donor only)
const getDonations = async (req, res, next) => {
  try {
    const donorId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { donorId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const donations = await Donation.find(filter)
      .populate('projectId', 'name location ngoId')
      .populate({
        path: 'projectId',
        populate: {
          path: 'ngoId',
          select: 'name organization'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments(filter);

    // Get donation statistics for this donor
    const allDonations = await Donation.find({ donorId });
    const donationStats = {
      donationCount: allDonations.length,
      totalAmount: allDonations.reduce((sum, d) => sum + d.amount, 0),
      projectCount: new Set(allDonations.map(d => d.projectId.toString())).size,
      averageDonation: allDonations.length > 0 ? 
        allDonations.reduce((sum, d) => sum + d.amount, 0) / allDonations.length : 0
    };

    res.status(200).json({
      success: true,
      data: donations,
      stats: donationStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get donations error:', error);
    next(error);
  }
};

// @desc    Get donation impact details
// @route   GET /api/donor/impact/:donationId
// @access  Private (Donor only)
const getDonationImpact = async (req, res, next) => {
  try {
    const donationId = req.params.donationId;
    const donorId = req.user.id;

    // Find donation and verify ownership
    const donation = await Donation.findOne({ _id: donationId, donorId })
      .populate('projectId', 'name description location')
      .populate({
        path: 'projectId',
        populate: {
          path: 'ngoId',
          select: 'name organization'
        }
      });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Get proofs related to this donation
    const proofs = await Proof.find({ donationIds: donationId })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    // Get beneficiaries helped by this donation
    const beneficiaries = await Beneficiary.find({
      projectId: donation.projectId._id,
      'aidReceived.donationId': donationId
    });

    res.status(200).json({
      success: true,
      data: {
        donation,
        proofs,
        beneficiaries,
        impactSummary: {
          proofsCount: proofs.length,
          beneficiariesHelped: beneficiaries.length,
          verifiedProofs: proofs.filter(p => p.verificationStatus === 'verified').length
        }
      }
    });
  } catch (error) {
    logger.error('Get donation impact error:', error);
    next(error);
  }
};

// @desc    Get donor notifications
// @route   GET /api/donor/notifications
// @access  Private (Donor only)
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === 'true';
    }

    const notifications = await Notification.find(filter)
      .populate('donationId', 'amount purpose')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/donor/notifications/:notificationId/read
// @access  Private (Donor only)
const markNotificationRead = async (req, res, next) => {
  try {
    const notificationId = req.params.notificationId;
    const userId = req.user.id;

    const notification = await Notification.findOne({ _id: notificationId, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Mark notification read error:', error);
    next(error);
  }
};

// @desc    Create new donation
// @route   POST /api/donor/donate
// @access  Private (Donor only)
const createDonation = async (req, res, next) => {
  try {
    const { projectId, amount, purpose, message, isAnonymous } = req.body;
    const donorId = req.user.id;

    // Validate project exists and is active
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Project is not accepting donations'
      });
    }

    // Create donation
    const donation = await Donation.create({
      donorId,
      projectId,
      amount,
      purpose,
      message,
      isAnonymous: isAnonymous || false,
      transactionId: `TXN_${uuidv4()}`,
      status: 'pending'
    });

    // Update project current amount
    project.currentAmount += amount;
    await project.save();

    // Create notification for NGO
    await Notification.create({
      userId: project.ngoId,
      type: 'donation_received',
      title: 'New Donation Received',
      message: `You received a donation of ₹${amount} for ${project.name}`,
      donationId: donation._id,
      projectId: project._id
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
    });
  } catch (error) {
    logger.error('Create donation error:', error);
    next(error);
  }
};

module.exports = {
  getDashboard,
  getDonations,
  getDonationImpact,
  getNotifications,
  markNotificationRead,
  createDonation
};