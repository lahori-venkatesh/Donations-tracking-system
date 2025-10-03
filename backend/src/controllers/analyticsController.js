const User = require('../models/User');
const Project = require('../models/Project');
const Donation = require('../models/Donation');
const logger = require('../utils/logger');

// @desc    Get public statistics
// @route   GET /api/v1/analytics/public/stats
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    // Get overall platform statistics
    const [
      totalDonations,
      totalProjects,
      totalNGOs,
      totalDonors,
      donationStats
    ] = await Promise.all([
      Donation.countDocuments({ status: 'completed' }),
      Project.countDocuments({ status: { $in: ['active', 'funded', 'completed'] } }),
      User.countDocuments({ role: 'ngo' }),
      User.countDocuments({ role: 'donor' }),
      Donation.getDonationStats({ status: 'completed' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDonations,
        totalProjects,
        totalNGOs,
        totalDonors,
        totalAmountRaised: donationStats.totalAmount,
        averageDonation: donationStats.averageDonation
      }
    });
  } catch (error) {
    logger.error('Get public stats error:', error);
    next(error);
  }
};

// @desc    Get public trends
// @route   GET /api/v1/analytics/public/trends
// @access  Public
const getPublicTrends = async (req, res, next) => {
  try {
    // Get monthly donation trends for the last 12 months
    const monthlyTrends = await Donation.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get category-wise project distribution
    const categoryStats = await Project.aggregate([
      { $match: { status: { $in: ['active', 'funded', 'completed'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyTrends,
        categoryStats
      }
    });
  } catch (error) {
    logger.error('Get public trends error:', error);
    next(error);
  }
};

// @desc    Get donor analytics
// @route   GET /api/v1/analytics/donor/dashboard
// @access  Private (Donor only)
const getDonorAnalytics = async (req, res, next) => {
  try {
    const donorId = req.user.id;

    // Get donor's donation analytics
    const donorStats = await Donation.getDonationStats({ 
      donor: donorId, 
      status: 'completed' 
    });

    // Get monthly donation pattern
    const monthlyPattern = await Donation.aggregate([
      {
        $match: {
          donor: donorId,
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get category preferences
    const categoryPreferences = await Donation.aggregate([
      { $match: { donor: donorId, status: 'completed' } },
      { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'projectData' } },
      { $unwind: '$projectData' },
      { $group: { _id: '$projectData.category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overallStats: donorStats,
        monthlyPattern,
        categoryPreferences
      }
    });
  } catch (error) {
    logger.error('Get donor analytics error:', error);
    next(error);
  }
};

// @desc    Get donor impact analytics
// @route   GET /api/v1/analytics/donor/impact
// @access  Private (Donor only)
const getDonorImpact = async (req, res, next) => {
  try {
    const donorId = req.user.id;

    // Get projects supported by donor
    const supportedProjects = await Project.find({
      donations: { 
        $in: await Donation.find({ donor: donorId, status: 'completed' }).distinct('_id') 
      }
    }).select('title beneficiaries transparency.impactMetrics');

    // Calculate total impact
    let totalBeneficiaries = 0;
    const impactMetrics = {};

    supportedProjects.forEach(project => {
      totalBeneficiaries += project.beneficiaries?.currentCount || 0;
      
      project.transparency?.impactMetrics?.forEach(metric => {
        if (!impactMetrics[metric.metric]) {
          impactMetrics[metric.metric] = { value: 0, unit: metric.unit };
        }
        impactMetrics[metric.metric].value += metric.value;
      });
    });

    res.status(200).json({
      success: true,
      data: {
        projectsSupported: supportedProjects.length,
        totalBeneficiaries,
        impactMetrics,
        supportedProjects: supportedProjects.map(p => ({
          id: p._id,
          title: p.title,
          beneficiaries: p.beneficiaries?.currentCount || 0
        }))
      }
    });
  } catch (error) {
    logger.error('Get donor impact error:', error);
    next(error);
  }
};

// @desc    Get NGO analytics
// @route   GET /api/v1/analytics/ngo/dashboard
// @access  Private (NGO only)
const getNGOAnalytics = async (req, res, next) => {
  try {
    const ngoId = req.user.id;

    // Get NGO projects
    const projects = await Project.find({ ngo: ngoId });
    const projectIds = projects.map(p => p._id);

    // Get donation analytics for NGO projects
    const donationStats = await Donation.getDonationStats({
      project: { $in: projectIds },
      status: 'completed'
    });

    // Get project performance
    const projectPerformance = projects.map(project => ({
      id: project._id,
      title: project.title,
      targetAmount: project.funding.targetAmount,
      raisedAmount: project.funding.raisedAmount,
      fundingPercentage: project.fundingPercentage,
      donationCount: project.donations?.length || 0,
      status: project.status
    }));

    // Get monthly funding trends
    const monthlyFunding = await Donation.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overallStats: donationStats,
        projectPerformance,
        monthlyFunding,
        totalProjects: projects.length
      }
    });
  } catch (error) {
    logger.error('Get NGO analytics error:', error);
    next(error);
  }
};

// @desc    Get project analytics
// @route   GET /api/v1/analytics/ngo/projects/:projectId/analytics
// @access  Private (NGO only)
const getProjectAnalytics = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const ngoId = req.user.id;

    const project = await Project.findOne({ _id: projectId, ngo: ngoId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get donation analytics for this project
    const donationStats = await Donation.getDonationStats({
      project: projectId,
      status: 'completed'
    });

    // Get donation timeline
    const donationTimeline = await Donation.find({
      project: projectId,
      status: 'completed'
    }).select('amount createdAt').sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        project: {
          title: project.title,
          targetAmount: project.funding.targetAmount,
          raisedAmount: project.funding.raisedAmount,
          fundingPercentage: project.fundingPercentage
        },
        donationStats,
        donationTimeline
      }
    });
  } catch (error) {
    logger.error('Get project analytics error:', error);
    next(error);
  }
};

// @desc    Get admin overview analytics
// @route   GET /api/v1/analytics/admin/overview
// @access  Private (Admin only)
const getAdminOverview = async (req, res, next) => {
  try {
    // Get comprehensive platform statistics
    const [
      totalUsers,
      totalDonations,
      totalProjects,
      donationStats,
      userGrowth,
      projectGrowth
    ] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments({ status: 'completed' }),
      Project.countDocuments(),
      Donation.getDonationStats({ status: 'completed' }),
      // User growth in last 30 days
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      // Project growth in last 30 days
      Project.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonations,
        totalProjects,
        totalAmountRaised: donationStats.totalAmount,
        userGrowth,
        projectGrowth,
        averageDonation: donationStats.averageDonation
      }
    });
  } catch (error) {
    logger.error('Get admin overview error:', error);
    next(error);
  }
};

// @desc    Get fraud detection analytics
// @route   GET /api/v1/analytics/admin/fraud-detection
// @access  Private (Admin only)
const getFraudAnalytics = async (req, res, next) => {
  try {
    // Get high-risk donations
    const highRiskDonations = await Donation.find({
      'fraudCheck.riskScore': { $gte: 70 }
    }).populate('donor', 'name email').populate('project', 'title');

    // Get flagged projects
    const flaggedProjects = await Project.find({
      'fraudPrevention.riskScore': { $gte: 70 }
    }).populate('ngo', 'name email');

    res.status(200).json({
      success: true,
      data: {
        highRiskDonations,
        flaggedProjects,
        totalHighRiskDonations: highRiskDonations.length,
        totalFlaggedProjects: flaggedProjects.length
      }
    });
  } catch (error) {
    logger.error('Get fraud analytics error:', error);
    next(error);
  }
};

// @desc    Get verification statistics
// @route   GET /api/v1/analytics/admin/verification-stats
// @access  Private (Admin only)
const getVerificationStats = async (req, res, next) => {
  try {
    const verificationStats = await User.aggregate([
      { $match: { role: 'ngo' } },
      { $group: { _id: '$ngoProfile.verification.level', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: verificationStats
    });
  } catch (error) {
    logger.error('Get verification stats error:', error);
    next(error);
  }
};

module.exports = {
  getPublicStats,
  getPublicTrends,
  getDonorAnalytics,
  getDonorImpact,
  getNGOAnalytics,
  getProjectAnalytics,
  getAdminOverview,
  getFraudAnalytics,
  getVerificationStats
};