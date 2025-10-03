const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add beneficiary name'],
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  category: {
    type: String,
    enum: ['individual', 'family', 'community'],
    required: true
  },
  isAnonymized: {
    type: Boolean,
    default: false
  },
  aidReceived: [{
    donationId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Donation'
    },
    amount: Number,
    date: Date,
    type: String,
    description: String
  }],
  photos: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  story: {
    type: String,
    maxlength: [1000, 'Story cannot be more than 1000 characters']
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total aid received
beneficiarySchema.virtual('totalAidReceived').get(function() {
  return this.aidReceived.reduce((total, aid) => total + (aid.amount || 0), 0);
});

// Indexes
beneficiarySchema.index({ projectId: 1 });
beneficiarySchema.index({ category: 1 });
beneficiarySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);