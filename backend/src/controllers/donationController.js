const Donation = require('../models/Donation');
const Project = require('../models/Project');
const User = require('../models/User');
const { processPayment, createPaymentIntent } = require('../utils/payment');
const { calculateFraudRisk } = require('../utils/fraudDetection');

// @desc    Create donation intent
// @route   POST /api/donations/intent
// @access  Private
exports.createDonationIntent = async (req, res) => {
  try {
    const { projectId, amount, paymentMethod, isAnonymous, donorMessage, dedicatedTo } = req.body;

    // Validate project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'active' || project.adminStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Project is not available for donations'
      });
    }

    // Validate amount
    if (amount < 1 || amount > 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation amount'
      });
    }

    // Calculate processing fee (2.5% + ₹3)
    const processingFee = Math.round(amount * 0.025 + 3);
    const netAmount = amount - processingFee;

    // Calculate fraud risk
    const fraudRisk = await calculateFraudRisk({
      donorId: req.user.id,
      projectId,
      amount,
      paymentMethod,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Generate transaction ID
    const transactionId = `DT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      project: projectId,
      amount,
      netAmount,
      currency: 'INR',
      paymentMethod,
      transactionId,
      status: 'pending',
      isAnonymous: isAnonymous || false,
      donorMessage,
      dedicatedTo,
      processingFee,
      fraudCheck: {
        riskScore: fraudRisk.score,
        flags: fraudRisk.flags
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      }
    });

    // Create payment intent with gateway
    let paymentIntent = null;
    try {
      paymentIntent = await createPaymentIntent({
        amount,
        currency: 'INR',
        transactionId,
        donorEmail: req.user.email,
        projectTitle: project.title
      });
    } catch (paymentError) {
      console.error('Payment intent creation failed:', paymentError);
      return res.status(500).json({
        success: false,
        message: 'Payment processing error'
      });
    }

    res.status(201).json({
      success: true,
      donation: {
        id: donation._id,
        transactionId: donation.transactionId,
        amount: donation.amount,
        processingFee: donation.processingFee,
        netAmount: donation.netAmount,
        fraudRiskScore: donation.fraudCheck.riskScore
      },
      paymentIntent
    });
  } catch (error) {
    console.error('Create donation intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating donation'
    });
  }
};

// @desc    Confirm donation payment
// @route   POST /api/donations/:id/confirm
// @access  Private
exports.confirmDonation = async (req, res) => {
  try {
    const { paymentId, signature } = req.body;

    const donation = await Donation.findById(req.params.id)
      .populate('project', 'title ngo')
      .populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Verify payment with gateway
    const paymentVerification = await processPayment({
      paymentId,
      signature,
      transactionId: donation.transactionId
    });

    if (!paymentVerification.success) {
      donation.status = 'failed';
      donation.paymentStatus = 'failed';
      await donation.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update donation status
    donation.status = 'completed';
    donation.paymentStatus = 'captured';
    donation.gatewayTransactionId = paymentId;
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation confirmed successfully',
      donation: {
        id: donation._id,
        transactionId: donation.transactionId,
        receiptNumber: donation.receiptNumber,
        amount: donation.amount,
        netAmount: donation.netAmount
      }
    });
  } catch (error) {
    console.error('Confirm donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming donation'
    });
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my
// @access  Private
exports.getMyDonations = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;

    let query = { donor: req.user.id };
    if (status !== 'all') {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .populate('project', 'title ngo images')
      .populate('project.ngo', 'name ngoProfile.organizationName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    // Calculate totals
    const totals = await Donation.aggregate([
      { $match: { donor: req.user.id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$netAmount' },
          totalDonations: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      donations,
      summary: totals[0] || { totalAmount: 0, totalDonations: 0 }
    });
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donations'
    });
  }
};

// @desc    Get donations for project (NGO view)
// @route   GET /api/donations/project/:projectId
// @access  Private (NGO owner only)
exports.getProjectDonations = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user owns the project
    if (project.ngo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these donations'
      });
    }

    const { page = 1, limit = 20 } = req.query;

    const donations = await Donation.find({
      project: req.params.projectId,
      status: 'completed'
    })
      .populate('donor', 'name email donorProfile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments({
      project: req.params.projectId,
      status: 'completed'
    });

    // Format donations for NGO view (respect anonymity)
    const formattedDonations = donations.map(donation => ({
      _id: donation._id,
      amount: donation.amount,
      netAmount: donation.netAmount,
      donorName: donation.isAnonymous || donation.donor?.donorProfile?.isAnonymous 
        ? 'Anonymous Donor' 
        : donation.donor?.name,
      donorEmail: donation.isAnonymous || donation.donor?.donorProfile?.isAnonymous 
        ? null 
        : donation.donor?.email,
      donorMessage: donation.donorMessage,
      dedicatedTo: donation.dedicatedTo,
      createdAt: donation.createdAt,
      transactionId: donation.transactionId
    }));

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      donations: formattedDonations
    });
  } catch (error) {
    console.error('Get project donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project donations'
    });
  }
};

// @desc    Get donation receipt
// @route   GET /api/donations/:id/receipt
// @access  Private (Donor only)
exports.getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('project', 'title ngo')
      .populate('project.ngo', 'name ngoProfile.organizationName')
      .populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt'
      });
    }

    if (donation.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Receipt not available for incomplete donations'
      });
    }

    res.status(200).json({
      success: true,
      receipt: {
        receiptNumber: donation.receiptNumber,
        transactionId: donation.transactionId,
        donorName: donation.donor.name,
        donorEmail: donation.donor.email,
        projectTitle: donation.project.title,
        ngoName: donation.project.ngo.ngoProfile?.organizationName || donation.project.ngo.name,
        amount: donation.amount,
        processingFee: donation.processingFee,
        netAmount: donation.netAmount,
        donationDate: donation.createdAt,
        taxDeductible: donation.taxDeductible,
        paymentMethod: donation.paymentMethod
      }
    });
  } catch (error) {
    console.error('Get donation receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching receipt'
    });
  }
};