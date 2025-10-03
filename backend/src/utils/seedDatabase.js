const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Donation = require('../models/Donation');

// Test users data
const testUsers = [
  {
    name: 'Test Donor',
    email: 'donor@test.com',
    password: 'donor123',
    role: 'donor',
    phone: '+91 9876543210',
    isVerified: true,
    isActive: true,
    donorProfile: {
      totalDonated: 5000,
      donationCount: 3,
      preferredCategories: ['education', 'healthcare']
    }
  },
  {
    name: 'Test NGO',
    email: 'ngo@test.com',
    password: 'ngo123',
    role: 'ngo',
    phone: '+91 9876543211',
    isVerified: true,
    isActive: true,
    ngoProfile: {
      organizationName: 'Test NGO Foundation',
      verificationStatus: 'verified',
      registrationNumber: 'NGO123456',
      description: 'A test NGO for development and testing purposes',
      website: 'https://testngo.org',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    }
  },
  {
    name: 'Admin User',
    email: 'admin@donatetrack.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9876543212',
    isVerified: true,
    isActive: true
  }
];

// Sample projects data
const sampleProjects = [
  {
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to rural communities in Maharashtra. This project aims to install water purification systems and educate communities about water hygiene.',
    category: 'water',
    targetAmount: 50000,
    raisedAmount: 15000,
    location: 'Rural Maharashtra',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    images: [
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800'
    ],
    urgency: 'high'
  },
  {
    title: 'Education for All',
    description: 'Supporting underprivileged children with educational resources, books, and school supplies. Helping bridge the education gap in rural areas.',
    category: 'education',
    targetAmount: 75000,
    raisedAmount: 25000,
    location: 'Rural Karnataka',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-31'),
    images: [
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'
    ],
    urgency: 'medium'
  },
  {
    title: 'Medical Camp Setup',
    description: 'Organizing medical camps in remote villages to provide basic healthcare services and medical checkups for underserved communities.',
    category: 'medical',
    targetAmount: 30000,
    raisedAmount: 8000,
    location: 'Remote Tamil Nadu',
    status: 'active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800'
    ],
    urgency: 'critical'
  }
];

// Sample donations data
const sampleDonations = [
  {
    amount: 2000,
    currency: 'INR',
    paymentMethod: 'razorpay',
    status: 'completed',
    message: 'Happy to contribute to this great cause!',
    isAnonymous: false,
    transactionId: 'TXN001'
  },
  {
    amount: 1500,
    currency: 'INR',
    paymentMethod: 'razorpay',
    status: 'completed',
    message: 'Keep up the good work!',
    isAnonymous: false,
    transactionId: 'TXN002'
  },
  {
    amount: 1000,
    currency: 'INR',
    paymentMethod: 'razorpay',
    status: 'completed',
    message: '',
    isAnonymous: true,
    transactionId: 'TXN003'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Donation.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create test users
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Find NGO user for projects
    const ngoUser = createdUsers.find(user => user.role === 'ngo');
    const donorUser = createdUsers.find(user => user.role === 'donor');

    // Create sample projects
    const createdProjects = [];
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        ngo: ngoUser._id
      });
      await project.save();
      createdProjects.push(project);
      console.log(`✅ Created project: ${project.title}`);
    }

    // Create sample donations
    for (let i = 0; i < sampleDonations.length; i++) {
      const donationData = sampleDonations[i];
      const project = createdProjects[i % createdProjects.length];
      
      const donation = new Donation({
        ...donationData,
        donor: donorUser._id,
        project: project._id
      });
      await donation.save();

      // Update project raised amount
      project.raisedAmount += donation.amount;
      await project.save();

      // Update donor profile
      donorUser.donorProfile.totalDonated += donation.amount;
      donorUser.donorProfile.donationCount += 1;
      await donorUser.save();

      console.log(`✅ Created donation: ₹${donation.amount} for ${project.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('👤 Donor: donor@test.com / donor123');
    console.log('🏢 NGO: ngo@test.com / ngo123');
    console.log('👨‍💼 Admin: admin@donatetrack.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Donation.deleteMany({});
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

module.exports = {
  seedDatabase,
  clearDatabase
};