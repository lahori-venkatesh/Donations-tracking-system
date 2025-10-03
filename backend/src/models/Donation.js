const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Donation amount must be at least ₹1'],
    max: [1000000, 'Donation amount cannot exceed ₹10 lakh']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['razorpay', 'stripe', 'paypal', 'bank-transfer', 'upi', 'wallet', 'other']
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'other']
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true
  },
  gatewayTransactionId: String,
  gatewayOrderId: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['initiated', 'authorized', 'captured', 'failed', 'cancelled', 'refunded'],
    default: 'initiated'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  donorMessage: {
    type: String,
    maxlength: [500, 'Donor message cannot exceed 500 characters']
  },
  dedicatedTo: {
    name: String,
    relationship: String,
    message: String
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  taxDeductible: {
    type: Boolean,
    default: true
  },
  taxExemptionCertificate: {
    filename: String,
    url: String,
    generatedAt: Date
  },
  processingFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  refund: {
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['requested', 'processing', 'completed', 'rejected']
    },
    requestedAt: Date,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundTransactionId: String
  },
  fraudCheck: {
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    flags: [{
      type: String,
      reason: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      }
    }],
    isReviewed: {
      type: Boolean,
      default: false
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewNotes: String
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String,
    location: {
      country: String,
      state: String,
      city: String
    },
    referrer: String,
    campaign: String,
    source: String
  },
  notifications: {
    donorNotified: {
      type: Boolean,
      default: false
    },
    ngoNotified: {
      type: Boolean,
      default: false
    },
    receiptSent: {
      type: Boolean,
      default: false
    },
    thankYouSent: {
      type: Boolean,
      default: false
    }
  },
  impact: {
    description: String,
    metrics: [{
      name: String,
      value: Number,
      unit: String
    }],
    proofDocuments: [{
      filename: String,
      url: String,
      uploadedAt: Date
    }],
    beneficiaryFeedback: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
donationSchema.index({ donor: 1 });
donationSchema.index({ project: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ transactionId: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ amount: -1 });
donationSchema.index({ 'fraudCheck.riskScore': -1 });
donationSchema.index({ 'fraudCheck.isReviewed': 1 });

// Virtual for formatted amount
donationSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for donation age
donationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
donationSchema.pre('save', function(next) {
  // Calculate net amount after processing fee
  if (this.isModified('amount') || this.isModified('processingFee')) {
    this.netAmount = this.amount - (this.processingFee || 0);
  }
  
  // Generate receipt number for completed donations
  if (this.status === 'completed' && !this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.receiptNumber = `DT${year}${month}${random}`;
  }
  
  next();
});

// Post-save middleware to update project raised amount
donationSchema.post('save', async function(doc) {
  if (doc.status === 'completed' && doc.isModified('status')) {
    try {
      const Project = mongoose.model('Project');
      await Project.findByIdAndUpdate(doc.project, {
        $inc: { 
          raisedAmount: doc.netAmount,
          donationCount: 1
        },
        $set: { lastDonationAt: new Date() }
      });
      
      // Update donor profile
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(doc.donor, {
        $inc: {
          'donorProfile.totalDonated': doc.netAmount,
          'donorProfile.donationCount': 1
        }
      });
    } catch (error) {
      console.error('Error updating project/donor stats:', error);
    }
  }
});

// Static methods
donationSchema.statics.findByDonor = function(donorId) {
  return this.find({ donor: donorId })
    .populate('project', 'title ngo')
    .populate('project.ngo', 'name ngoProfile.organizationName')
    .sort({ createdAt: -1 });
};

donationSchema.statics.findByProject = function(projectId) {
  return this.find({ project: projectId, status: 'completed' })
    .populate('donor', 'name donorProfile')
    .sort({ createdAt: -1 });
};

donationSchema.statics.findByNGO = function(ngoId) {
  return this.find({ status: 'completed' })
    .populate({
      path: 'project',
      match: { ngo: ngoId },
      select: 'title'
    })
    .populate('donor', 'name donorProfile')
    .sort({ createdAt: -1 });
};

donationSchema.statics.getAnalytics = function(startDate, endDate) {
  const matchStage = {
    status: 'completed',
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$netAmount' },
        totalDonations: { $sum: 1 },
        averageDonation: { $avg: '$netAmount' },
        uniqueDonors: { $addToSet: '$donor' }
      }
    },
    {
      $project: {
        totalAmount: 1,
        totalDonations: 1,
        averageDonation: { $round: ['$averageDonation', 2] },
        uniqueDonors: { $size: '$uniqueDonors' }
      }
    }
  ]);
};

// Instance methods
donationSchema.methods.processRefund = function(reason, processedBy) {
  this.refund = {
    amount: this.netAmount,
    reason,
    status: 'requested',
    requestedAt: new Date(),
    processedBy
  };
  this.status = 'refunded';
  return this.save();
};

donationSchema.methods.markAsReviewed = function(reviewedBy, notes) {
  this.fraudCheck.isReviewed = true;
  this.fraudCheck.reviewedBy = reviewedBy;
  this.fraudCheck.reviewedAt = new Date();
  this.fraudCheck.reviewNotes = notes;
  return this.save();
};

donationSchema.methods.addImpactProof = function(proofData) {
  if (!this.impact.proofDocuments) {
    this.impact.proofDocuments = [];
  }
  this.impact.proofDocuments.push({
    ...proofData,
    uploadedAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Donation', donationSchema);