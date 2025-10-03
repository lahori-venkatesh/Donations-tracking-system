const Project = require('../models/Project');
const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const {
      category,
      status = 'active',
      featured,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = {
      adminStatus: 'approved',
      status: status === 'all' ? { $ne: 'draft' } : status
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
      query.featuredUntil = { $gte: new Date() };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const projects = await Project.find(query)
      .populate('ngo', 'name ngoProfile.organizationName avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    // Add computed fields
    const projectsWithExtras = projects.map(project => ({
      ...project,
      completionPercentage: Math.min(Math.round((project.raisedAmount / project.targetAmount) * 100), 100),
      daysRemaining: Math.max(Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)), 0)
    }));

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      projects: projectsWithExtras
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ngo', 'name ngoProfile avatar email phone')
      .populate('reviewedBy', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get recent donations for this project
    const recentDonations = await Donation.find({
      project: project._id,
      status: 'completed'
    })
      .populate('donor', 'name donorProfile.isAnonymous')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format donations for privacy
    const formattedDonations = recentDonations.map(donation => ({
      _id: donation._id,
      amount: donation.amount,
      donorName: donation.isAnonymous || donation.donor?.donorProfile?.isAnonymous 
        ? 'Anonymous' 
        : donation.donor?.name || 'Anonymous',
      donorMessage: donation.donorMessage,
      createdAt: donation.createdAt
    }));

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        completionPercentage: Math.min(Math.round((project.raisedAmount / project.targetAmount) * 100), 100),
        daysRemaining: Math.max(Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)), 0),
        recentDonations: formattedDonations
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (NGO only)
exports.createProject = async (req, res) => {
  try {
    // Check if user is NGO and verified
    const user = await User.findById(req.user.id);
    if (user.role !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can create projects'
      });
    }

    if (user.ngoProfile.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'NGO must be verified to create projects'
      });
    }

    // Add NGO to project data
    const projectData = {
      ...req.body,
      ngo: req.user.id,
      status: 'draft',
      adminStatus: 'pending'
    };

    const project = await Project.create(projectData);

    // Update NGO project count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'ngoProfile.projectCount': 1 }
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (NGO owner only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.ngo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Don't allow updates to completed projects
    if (project.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed projects'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('ngo', 'name ngoProfile.organizationName');

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (NGO owner or admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.ngo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Don't allow deletion if project has donations
    if (project.raisedAmount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing donations'
      });
    }

    await project.deleteOne();

    // Update NGO project count
    await User.findByIdAndUpdate(project.ngo, {
      $inc: { 'ngoProfile.projectCount': -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
};

// @desc    Get projects by NGO
// @route   GET /api/projects/ngo/:ngoId
// @access  Public
exports.getProjectsByNGO = async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 10 } = req.query;

    let query = { ngo: req.params.ngoId };
    
    if (status !== 'all') {
      query.status = status;
      query.adminStatus = 'approved';
    }

    const projects = await Project.find(query)
      .populate('ngo', 'name ngoProfile.organizationName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      projects
    });
  } catch (error) {
    console.error('Get NGO projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching NGO projects'
    });
  }
};

// @desc    Get my projects (for logged in NGO)
// @route   GET /api/projects/my
// @access  Private (NGO only)
exports.getMyProjects = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can access this endpoint'
      });
    }

    const { status = 'all', page = 1, limit = 10 } = req.query;

    let query = { ngo: req.user.id };
    if (status !== 'all') {
      query.status = status;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      projects
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
};

// @desc    Add project update
// @route   POST /api/projects/:id/updates
// @access  Private (NGO owner only)
exports.addProjectUpdate = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    await project.addUpdate(req.body);

    res.status(201).json({
      success: true,
      message: 'Project update added successfully',
      project
    });
  } catch (error) {
    console.error('Add project update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding project update'
    });
  }
};

// @desc    Get project categories
// @route   GET /api/projects/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'education', label: 'Education', icon: '📚' },
      { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'environment', label: 'Environment', icon: '🌱' },
      { value: 'poverty', label: 'Poverty Alleviation', icon: '🤝' },
      { value: 'disaster-relief', label: 'Disaster Relief', icon: '🆘' },
      { value: 'animal-welfare', label: 'Animal Welfare', icon: '🐾' },
      { value: 'other', label: 'Other', icon: '📋' }
    ];

    // Get project counts for each category
    const categoryCounts = await Project.aggregate([
      {
        $match: {
          status: 'active',
          adminStatus: 'approved'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRaised: { $sum: '$raisedAmount' }
        }
      }
    ]);

    const categoriesWithCounts = categories.map(category => {
      const stats = categoryCounts.find(c => c._id === category.value);
      return {
        ...category,
        projectCount: stats?.count || 0,
        totalRaised: stats?.totalRaised || 0
      };
    });

    res.status(200).json({
      success: true,
      categories: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const projects = await Project.find({
      status: 'active',
      adminStatus: 'approved',
      isFeatured: true,
      featuredUntil: { $gte: new Date() }
    })
      .populate('ngo', 'name ngoProfile.organizationName avatar')
      .limit(parseInt(limit))
      .lean();

    const projectsWithExtras = projects.map(project => ({
      ...project,
      completionPercentage: Math.min(Math.round((project.raisedAmount / project.targetAmount) * 100), 100),
      daysRemaining: Math.max(Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)), 0)
    }));

    res.status(200).json({
      success: true,
      count: projects.length,
      projects: projectsWithExtras
    });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured projects'
    });
  }
};

// @desc    Donate to project
// @route   POST /api/projects/:id/donate
// @access  Private (Donor only)
exports.donateToProject = async (req, res) => {
  try {
    const { amount, message, isAnonymous } = req.body;
    const projectId = req.params.id;
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
      donor: donorId,
      project: projectId,
      amount,
      message: message || '',
      isAnonymous: isAnonymous || false,
      status: 'completed', // In real app, this would be 'pending' until payment is processed
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Update project raised amount
    project.raisedAmount += amount;
    await project.save();

    // Update donor profile
    await User.findByIdAndUpdate(donorId, {
      $inc: {
        'donorProfile.totalDonated': amount,
        'donorProfile.donationCount': 1
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation successful',
      donation: {
        id: donation._id,
        amount: donation.amount,
        transactionId: donation.transactionId,
        createdAt: donation.createdAt
      }
    });
  } catch (error) {
    console.error('Donate to project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing donation'
    });
  }
};