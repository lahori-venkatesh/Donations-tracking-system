const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  donationIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Donation'
  }],
  type: {
    type: String,
    enum: ['photo', 'receipt', 'document', 'video'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add file URL']
  },
  thumbnailUrl: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  metadata: {
    fileSize: Number,
    mimeType: String,
    originalName: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  tags: [String],
  location: {
    type: String
  },
  beneficiaries: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Beneficiary'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
proofSchema.index({ projectId: 1 });
proofSchema.index({ donationIds: 1 });
proofSchema.index({ type: 1 });
proofSchema.index({ verificationStatus: 1 });
proofSchema.index({ uploadedBy: 1 });
proofSchema.index({ createdAt: -1 });

// Update verification status
proofSchema.methods.verify = function(verifiedBy, status = 'verified') {
  this.verificationStatus = status;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  return this.save();
};

proofSchema.methods.reject = function(verifiedBy, reason) {
  this.verificationStatus = 'rejected';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

module.exports = mongoose.model('Proof', proofSchema);