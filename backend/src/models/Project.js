const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['education', 'healthcare', 'environment', 'poverty', 'disaster-relief', 'animal-welfare', 'other']
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'NGO is required']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [100, 'Target amount must be at least ₹100'],
    max: [10000000, 'Target amount cannot exceed ₹1 crore']
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Raised amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  images: [{
    filename: String,
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['proposal', 'budget', 'approval', 'other']
    },
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'cancelled', 'suspended'],
    default: 'draft'
  },
  adminStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  beneficiaries: {
    targetCount: {
      type: Number,
      min: [1, 'Target beneficiaries must be at least 1']
    },
    currentCount: {
      type: Number,
      default: 0
    },
    demographics: {
      ageGroups: [{
        range: String, // e.g., "0-5", "6-12", "13-18", "18+"
        count: Number
      }],
      gender: {
        male: { type: Number, default: 0 },
        female: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
      }
    }
  },
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completedDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'delayed'],
      default: 'pending'
    },
    proofDocuments: [{
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  updates: [{
    title: String,
    content: String,
    images: [{
      filename: String,
      url: String,
      caption: String
    }],
    postedAt: {
      type: Date,
      default: Date.now
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  }],
  tags: [String],
  donationCount: {
    type: Number,
    default: 0
  },
  averageDonation: {
    type: Number,
    default: 0
  },
  lastDonationAt: Date,
  featuredUntil: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  fraudRiskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadges: [{
    type: String,
    enum: ['government-approved', 'tax-exempt', 'transparency-certified', 'impact-verified']
  }],
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  contactInfo: {
    email: String,
    phone: String,
    contactPerson: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
projectSchema.index({ ngo: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ adminStatus: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });
projectSchema.index({ raisedAmount: -1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isFeatured: 1, featuredUntil: 1 });
projectSchema.index({ 'location.city': 1, 'location.state': 1 });

// Virtual for completion percentage
projectSchema.virtual('completionPercentage').get(function() {
  return Math.min(Math.round((this.raisedAmount / this.targetAmount) * 100), 100);
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for primary image
projectSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Pre-save middleware
projectSchema.pre('save', function(next) {
  // Update average donation
  if (this.donationCount > 0) {
    this.averageDonation = Math.round(this.raisedAmount / this.donationCount);
  }
  
  // Auto-complete project if target reached
  if (this.raisedAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Validate dates
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  
  next();
});

// Static methods
projectSchema.statics.findActiveProjects = function() {
  return this.find({
    status: 'active',
    adminStatus: 'approved',
    endDate: { $gte: new Date() }
  }).populate('ngo', 'name ngoProfile.organizationName');
};

projectSchema.statics.findByCategory = function(category) {
  return this.find({
    category,
    status: 'active',
    adminStatus: 'approved'
  }).populate('ngo', 'name ngoProfile.organizationName');
};

projectSchema.statics.findFeatured = function() {
  return this.find({
    isFeatured: true,
    featuredUntil: { $gte: new Date() },
    status: 'active',
    adminStatus: 'approved'
  }).populate('ngo', 'name ngoProfile.organizationName');
};

// Instance methods
projectSchema.methods.addUpdate = function(updateData) {
  this.updates.push({
    ...updateData,
    postedAt: new Date()
  });
  return this.save();
};

projectSchema.methods.addMilestone = function(milestoneData) {
  this.milestones.push(milestoneData);
  return this.save();
};

projectSchema.methods.updateRaisedAmount = function(amount) {
  this.raisedAmount += amount;
  this.donationCount += 1;
  this.lastDonationAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);