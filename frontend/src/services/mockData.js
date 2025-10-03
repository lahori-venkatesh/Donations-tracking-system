// Mock data for development and testing

// Mock Projects
export const mockProjects = [
  {
    id: '1',
    name: 'Clean Water Initiative',
    ngoId: '2',
    description: 'Providing clean drinking water to rural communities through well construction and water purification systems.',
    category: 'water',
    targetAmount: 50000,
    currentAmount: 32000,
    status: 'active',
    location: 'Rural Tamil Nadu',
    beneficiaries: ['1', '2', '3'],
    proofs: ['1', '2'],
    createdAt: '2024-01-01T00:00:00Z',
    endDate: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Education for All',
    ngoId: '2',
    description: 'Building schools and providing educational materials for underprivileged children.',
    category: 'education',
    targetAmount: 80000,
    currentAmount: 65000,
    status: 'active',
    location: 'Rural India',
    beneficiaries: ['4', '5'],
    proofs: ['3'],
    createdAt: '2024-01-05T00:00:00Z',
    endDate: '2024-04-20T00:00:00Z'
  }
];

// Mock Donations
export const mockDonations = [
  {
    id: '1',
    donorId: '1',
    projectId: '1',
    amount: 5000,
    currency: 'INR',
    status: 'used',
    purpose: 'Water pump installation',
    transactionId: 'TXN001',
    createdAt: '2024-01-10T00:00:00Z',
    usedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    donorId: '1',
    projectId: '2',
    amount: 3000,
    currency: 'INR',
    status: 'allocated',
    purpose: 'School supplies',
    transactionId: 'TXN002',
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '3',
    donorId: '1',
    projectId: '1',
    amount: 7500,
    currency: 'INR',
    status: 'pending',
    purpose: 'Water filtration system',
    transactionId: 'TXN003',
    createdAt: '2024-01-14T00:00:00Z'
  }
];

// Mock Proofs
export const mockProofs = [
  {
    id: '1',
    projectId: '1',
    donationIds: ['1'],
    type: 'photo',
    title: 'Water Pump Installation',
    description: 'New water pump installed and operational, serving 50 families.',
    fileUrl: '/mock-proof-1.jpg',
    uploadedBy: '2',
    verificationStatus: 'verified',
    createdAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    donationIds: ['1'],
    type: 'receipt',
    title: 'Equipment Purchase Receipt',
    description: 'Receipt for water pump and installation materials.',
    fileUrl: '/mock-receipt-1.pdf',
    uploadedBy: '2',
    verificationStatus: 'verified',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    projectId: '2',
    donationIds: ['2'],
    type: 'photo',
    title: 'School Supplies Distribution',
    description: 'Books and supplies distributed to 30 students.',
    fileUrl: '/mock-proof-2.jpg',
    uploadedBy: '2',
    verificationStatus: 'pending',
    createdAt: '2024-01-18T00:00:00Z'
  }
];

// Mock Beneficiaries
export const mockBeneficiaries = [
  {
    id: '1',
    projectId: '1',
    name: 'Meera Nair',
    age: 35,
    location: 'Kumbakonam Village, Tamil Nadu',
    category: 'family',
    isAnonymized: false,
    aidReceived: [
      {
        donationId: '1',
        amount: 1000,
        date: '2024-01-16T00:00:00Z',
        type: 'Clean water access'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    name: 'Ravi Subramanian',
    age: 42,
    location: 'Kumbakonam Village, Tamil Nadu',
    category: 'individual',
    isAnonymized: false,
    aidReceived: [
      {
        donationId: '1',
        amount: 800,
        date: '2024-01-16T00:00:00Z',
        type: 'Water filtration system'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    projectId: '1',
    name: 'Community Center',
    age: null,
    location: 'Kumbakonam Village, Tamil Nadu',
    category: 'community',
    isAnonymized: false,
    aidReceived: [
      {
        donationId: '1',
        amount: 2000,
        date: '2024-01-16T00:00:00Z',
        type: 'Community water well'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    projectId: '2',
    name: 'Priya Sharma',
    age: 8,
    location: 'Village B, India',
    category: 'individual',
    isAnonymized: false,
    aidReceived: [
      {
        donationId: '2',
        amount: 500,
        date: '2024-01-18T00:00:00Z',
        type: 'School supplies'
      }
    ],
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '5',
    projectId: '2',
    name: 'Raj Patel',
    age: 10,
    location: 'Village B, India',
    category: 'individual',
    isAnonymized: false,
    aidReceived: [
      {
        donationId: '2',
        amount: 500,
        date: '2024-01-18T00:00:00Z',
        type: 'School supplies'
      }
    ],
    createdAt: '2024-01-05T00:00:00Z'
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: '1',
    userId: '1',
    type: 'proof_uploaded',
    title: 'New Proof Uploaded',
    message: 'Water pump installation photos have been uploaded for your donation to Clean Water Initiative.',
    donationId: '1',
    projectId: '1',
    isRead: false,
    createdAt: '2024-01-16T02:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'impact_update',
    title: 'Impact Update',
    message: 'Your donation helped provide clean water access to 50 families in Village A.',
    donationId: '1',
    projectId: '1',
    isRead: false,
    createdAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    type: 'donation_used',
    title: 'Donation Utilized',
    message: 'Your donation of ₹5,000 has been used for water pump installation.',
    donationId: '1',
    projectId: '1',
    isRead: true,
    createdAt: '2024-01-15T14:00:00Z'
  }
];

// Helper functions to get data
export const getProjectById = (projectId) => {
  return mockProjects.find(project => project.id === projectId);
};

export const getDonationsByDonor = (donorId) => {
  return mockDonations.filter(donation => donation.donorId === donorId);
};

export const getProofsByDonation = (donationId) => {
  return mockProofs.filter(proof => proof.donationIds.includes(donationId));
};

export const getBeneficiariesByProject = (projectId) => {
  return mockBeneficiaries.filter(beneficiary => beneficiary.projectId === projectId);
};

export const getNotificationsByUser = (userId) => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const calculateDonorStats = (donorId) => {
  const donations = getDonationsByDonor(donorId);
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const activeProjects = new Set(donations.map(d => d.projectId)).size;
  
  // Calculate lives impacted based on beneficiaries from donated projects
  const projectIds = donations.map(d => d.projectId);
  const allBeneficiaries = mockBeneficiaries.filter(b => projectIds.includes(b.projectId));
  const livesImpacted = allBeneficiaries.length;

  return {
    totalDonated,
    livesImpacted,
    activeProjects,
    donations: donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  };
};