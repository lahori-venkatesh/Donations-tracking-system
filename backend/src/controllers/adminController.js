const User = require('../models/User');
const Project = require('../models/Project');
const Donation = require('../models/Donation');

// Dashboard overview
const getDashboard = async (req, res) => {
  try {
    // Get current date and previous month for comparison
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalDonations = await Donation.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Current month stats
    const currentMonthUsers = await User.countDocuments({ 
      createdAt: { $gte: currentMonth } 
    });
    const currentMonthDonations = await Donation.countDocuments({ 
      createdAt: { $gte: currentMonth } 
    });
    const currentMonthProjects = await Project.countDocuments({ 
      createdAt: { $gte: currentMonth } 
    });

    // Previous month stats for growth calculation
    const previousMonthUsers = await User.countDocuments({ 
      createdAt: { $gte: previousMonth, $lt: currentMonth } 
    });
    const previousMonthDonations = await Donation.countDocuments({ 
      createdAt: { $gte: previousMonth, $lt: currentMonth } 
    });
    const previousMonthProjects = await Project.countDocuments({ 
      createdAt: { $gte: previousMonth, $lt: currentMonth } 
    });

    // Calculate growth percentages
    const userGrowth = previousMonthUsers > 0 
      ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
      : 100;
    const donationGrowth = previousMonthDonations > 0 
      ? ((currentMonthDonations - previousMonthDonations) / previousMonthDonations * 100).toFixed(1)
      : 100;
    const projectGrowth = previousMonthProjects > 0 
      ? ((currentMonthProjects - previousMonthProjects) / previousMonthProjects * 100).toFixed(1)
      : 100;

    // Pending verifications
    const pendingNGOs = await User.countDocuments({ 
      role: 'ngo', 
      'ngoProfile.verificationStatus': 'pending' 
    });
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const flaggedDonations = await Donation.countDocuments({ flagged: true });

    // Recent activity
    const recentDonations = await Donation.find()
      .populate('donor', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProjects = await Project.find()
      .populate('ngo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Donation trends (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const donationTrends = await Donation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category distribution
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRaised: { $sum: '$raisedAmount' }
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalProjects,
        totalDonations,
        totalRevenue,
        userGrowth: parseFloat(userGrowth),
        donationGrowth: parseFloat(donationGrowth),
        projectGrowth: parseFloat(projectGrowth)
      },
      alerts: {
        pendingNGOs,
        pendingProjects,
        flaggedDonations
      },
      recentActivity: {
        donations: recentDonations,
        projects: recentProjects
      },
      charts: {
        donationTrends,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard data' });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // User analytics
    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Donation analytics
    const donationAnalytics = await Donation.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top performing NGOs
    const topNGOs = await Donation.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      { $unwind: '$projectInfo' },
      {
        $group: {
          _id: '$projectInfo.ngo',
          totalRaised: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'ngos',
          localField: '_id',
          foreignField: '_id',
          as: 'ngoInfo'
        }
      },
      { $unwind: '$ngoInfo' },
      {
        $project: {
          name: '$ngoInfo.name',
          totalRaised: 1,
          donationCount: 1
        }
      },
      { $sort: { totalRaised: -1 } },
      { $limit: 10 }
    ]);

    // Fraud analytics
    const fraudStats = await Donation.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          flagged: { $sum: { $cond: ['$flagged', 1, 0] } },
          highRisk: { $sum: { $cond: [{ $gte: ['$riskScore', 75] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      userStats,
      donationAnalytics: donationAnalytics[0] || { totalAmount: 0, averageAmount: 0, count: 0 },
      topNGOs,
      fraudStats: fraudStats[0] || { total: 0, flagged: 0, highRisk: 0 }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error loading analytics data' });
  }
};

// Get platform statistics
const getPlatformStats = async (req, res) => {
  try {
    // User distribution
    const userDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Project status distribution
    const projectStatus = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly donation trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrends = await Donation.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Geographic distribution (if location data available)
    const geographicStats = await User.aggregate([
      { $match: { location: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      userDistribution,
      projectStatus,
      monthlyTrends,
      geographicStats
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({ message: 'Error loading platform statistics' });
  }
};

// Get fraud analytics
const getFraudAnalytics = async (req, res) => {
  try {
    // Risk score distribution
    const riskDistribution = await Donation.aggregate([
      {
        $bucket: {
          groupBy: '$riskScore',
          boundaries: [0, 25, 50, 75, 100],
          default: 'Unknown',
          output: {
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      }
    ]);

    // Flagged donations by reason
    const flaggedReasons = await Donation.aggregate([
      { $match: { flagged: true } },
      {
        $group: {
          _id: '$flagReason',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily fraud detection trends
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fraudTrends = await Donation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          flagged: { $sum: { $cond: ['$flagged', 1, 0] } },
          highRisk: { $sum: { $cond: [{ $gte: ['$riskScore', 75] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      riskDistribution,
      flaggedReasons,
      fraudTrends
    });
  } catch (error) {
    console.error('Fraud analytics error:', error);
    res.status(500).json({ message: 'Error loading fraud analytics' });
  }
};

// User management
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error loading users' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Manage user status
const manageUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let newStatus;
    switch (action) {
      case 'activate':
        newStatus = 'active';
        break;
      case 'deactivate':
        newStatus = 'inactive';
        break;
      case 'suspend':
        newStatus = 'suspended';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    user.status = newStatus;
    if (reason) user.statusReason = reason;
    await user.save();

    res.json({ 
      message: `User ${action}d successfully`,
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('Manage user status error:', error);
    res.status(500).json({ message: 'Error managing user status' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active donations or projects
    const activeDonations = await Donation.countDocuments({ donor: userId });
    const activeProjects = await Project.countDocuments({ ngo: userId });

    if (activeDonations > 0 || activeProjects > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with active donations or projects. Consider deactivating instead.' 
      });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Verify NGO
const verifyNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { status, notes } = req.body;

    const ngo = await User.findOne({ _id: ngoId, role: 'ngo' });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    ngo.ngoProfile.verificationStatus = status;
    if (notes) ngo.ngoProfile.verificationNotes = notes;
    ngo.ngoProfile.verifiedAt = status === 'verified' ? new Date() : null;
    ngo.ngoProfile.verifiedBy = req.user.id;

    await ngo.save();

    // Update user verification status if NGO is verified
    if (status === 'verified') {
      ngo.isVerified = true;
      await ngo.save();
    }

    res.json({ 
      message: `NGO ${status} successfully`,
      ngo 
    });
  } catch (error) {
    console.error('Verify NGO error:', error);
    res.status(500).json({ message: 'Error verifying NGO' });
  }
};

// Manage project status
const manageProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, reason } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.status = status;
    if (reason) project.statusReason = reason;
    project.reviewedBy = req.user.id;
    project.reviewedAt = new Date();

    await project.save();

    res.json({ 
      message: `Project status updated to ${status}`,
      project 
    });
  } catch (error) {
    console.error('Manage project status error:', error);
    res.status(500).json({ message: 'Error managing project status' });
  }
};

// Get verification queue
const getVerificationQueue = async (req, res) => {
  try {
    const { type = 'all', priority = 'all' } = req.query;

    let items = [];

    // Get pending NGOs
    if (type === 'all' || type === 'ngo') {
      const pendingNGOs = await User.find({ 
        role: 'ngo', 
        'ngoProfile.verificationStatus': 'pending' 
      })
        .sort({ createdAt: -1 });
      
      items = items.concat(pendingNGOs.map(ngo => ({
        ...ngo.toObject(),
        type: 'ngo',
        priority: 'high'
      })));
    }

    // Get pending projects
    if (type === 'all' || type === 'project') {
      const pendingProjects = await Project.find({ status: 'pending' })
        .populate('ngo', 'name')
        .sort({ createdAt: -1 });
      
      items = items.concat(pendingProjects.map(project => ({
        ...project.toObject(),
        type: 'project',
        priority: 'medium'
      })));
    }

    // Get flagged donations
    if (type === 'all' || type === 'donation') {
      const flaggedDonations = await Donation.find({ flagged: true, reviewed: false })
        .populate('donor', 'name email')
        .populate('project', 'title')
        .sort({ createdAt: -1 });
      
      items = items.concat(flaggedDonations.map(donation => ({
        ...donation.toObject(),
        type: 'donation',
        priority: donation.riskScore >= 90 ? 'critical' : 'high'
      })));
    }

    // Filter by priority if specified
    if (priority !== 'all') {
      items = items.filter(item => item.priority === priority);
    }

    // Sort by priority and date
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    items.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ items });
  } catch (error) {
    console.error('Verification queue error:', error);
    res.status(500).json({ message: 'Error loading verification queue' });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { 
      type = 'donations',
      startDate,
      endDate,
      format = 'json'
    } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let data = [];

    switch (type) {
      case 'donations':
        data = await Donation.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
          .populate('donor', 'name email')
          .populate('project', 'title category')
          .sort({ createdAt: -1 });
        break;
      
      case 'users':
        data = await User.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
          .select('-password')
          .sort({ createdAt: -1 });
        break;
      
      case 'projects':
        data = await Project.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
          .populate('ngo', 'name')
          .sort({ createdAt: -1 });
        break;
      
      case 'ngos':
        data = await User.find({ 
          role: 'ngo',
          ...(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        })
          .sort({ createdAt: -1 });
        break;
    }

    res.json({ data, type, count: data.length });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

// Export report
const exportReport = async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv', startDate, endDate } = req.query;

    // This would typically generate and return a file
    // For now, we'll return the data structure
    const reportData = await getReports({ query: { type, startDate, endDate } });
    
    res.json({ 
      message: `${type} report exported as ${format}`,
      downloadUrl: `/api/admin/reports/download/${type}-${Date.now()}.${format}`
    });
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ message: 'Error exporting report' });
  }
};

module.exports = {
  getDashboard,
  getAnalytics,
  getPlatformStats,
  getFraudAnalytics,
  getUsers,
  updateUser,
  manageUserStatus,
  deleteUser,
  verifyNGO,
  manageProjectStatus,
  getVerificationQueue,
  getReports,
  exportReport
};