// Mock API for development - simulates backend responses
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'donor@example.com',
    password: 'password123', // In real app, this would be hashed
    name: 'Arjun Krishnan',
    role: 'donor',
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'ngo@example.com',
    password: 'password123',
    name: 'Jane Smith',
    organization: 'Hope Foundation',
    role: 'ngo',
    phone: '+1234567891',
    createdAt: new Date().toISOString(),
  }
];

// Generate JWT-like token (mock)
const generateToken = (user) => {
  return btoa(JSON.stringify({ 
    userId: user.id, 
    role: user.role, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
};

// Mock Auth API
export const mockAuthAPI = {
  login: async (credentials) => {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.role === credentials.role
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password, ...userWithoutPassword } = user;
    const token = generateToken(user);
    
    return {
      data: {
        token,
        user: userWithoutPassword
      }
    };
  },

  register: async (userData) => {
    await delay(1000);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    const token = generateToken(newUser);
    
    return {
      data: {
        token,
        user: userWithoutPassword
      }
    };
  },

  logout: async () => {
    await delay(500);
    return { data: { message: 'Logged out successfully' } };
  },

  getProfile: async () => {
    await delay(500);
    // This would normally validate the token and return user data
    return { data: { user: mockUsers[0] } };
  }
};

// Mock donations database
const mockDonations = [
  {
    id: '1',
    donorId: '1',
    projectId: '1',
    amount: 5000,
    date: '2024-01-15',
    status: 'completed',
    message: 'Keep up the great work!'
  },
  {
    id: '2',
    donorId: '1',
    projectId: '2',
    amount: 3000,
    date: '2024-01-20',
    status: 'completed',
    message: 'Happy to help!'
  },
  {
    id: '3',
    donorId: '1',
    projectId: '3',
    amount: 2500,
    date: '2024-01-25',
    status: 'completed',
    message: 'Great cause!'
  },
  {
    id: '4',
    donorId: '1',
    projectId: '1',
    amount: 4000,
    date: '2024-01-28',
    status: 'completed',
    message: 'Second donation to this project'
  },
  {
    id: '5',
    donorId: '1',
    projectId: '4',
    amount: 6000,
    date: '2024-01-30',
    status: 'completed',
    message: 'Love this initiative!'
  }
];

// Mock donation API
export const mockDonationAPI = {
  // Get user donations
  getUserDonations: async (userId) => {
    await delay(500);
    const userDonations = mockDonations.filter(d => d.donorId === userId);
    return { data: userDonations };
  },

  // Get user donation stats for badges
  getUserDonationStats: async (userId) => {
    await delay(300);
    const userDonations = mockDonations.filter(d => d.donorId === userId);
    const stats = {
      donationCount: userDonations.length,
      totalAmount: userDonations.reduce((sum, d) => sum + d.amount, 0),
      projectCount: new Set(userDonations.map(d => d.projectId)).size,
      firstDonationDate: userDonations.length > 0 ? Math.min(...userDonations.map(d => new Date(d.date))) : null,
      lastDonationDate: userDonations.length > 0 ? Math.max(...userDonations.map(d => new Date(d.date))) : null,
      averageDonation: userDonations.length > 0 ? userDonations.reduce((sum, d) => sum + d.amount, 0) / userDonations.length : 0
    };
    return { data: stats };
  },

  // Create new donation
  createDonation: async (donationData) => {
    await delay(1000);
    const newDonation = {
      id: Date.now().toString(),
      ...donationData,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    mockDonations.push(newDonation);
    return { data: newDonation };
  }
};

// Override the real API with mock for development
export const authAPI = mockAuthAPI;
export const donationAPI = mockDonationAPI;