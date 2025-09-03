// Leaderboard Service for Donor Rankings
class LeaderboardService {
  // Mock data for demonstration
  getMockLeaderboardData() {
    return {
      topDonorsThisMonth: [
        {
          id: '1',
          name: 'Priya Sharma',
          totalAmount: 25000,
          donationCount: 8,
          avatar: null,
          isAnonymous: false,
          badges: ['hero', 'generous'],
          lastDonation: '2024-01-28'
        },
        {
          id: '2',
          name: 'Venkatesh Kumar',
          totalAmount: 15000,
          donationCount: 6,
          avatar: null,
          isAnonymous: false,
          badges: ['champion', 'generous'],
          lastDonation: '2024-01-27'
        },
        {
          id: '3',
          name: 'Anonymous Donor',
          totalAmount: 12000,
          donationCount: 4,
          avatar: null,
          isAnonymous: true,
          badges: ['supporter'],
          lastDonation: '2024-01-26'
        },
        {
          id: '4',
          name: 'Anil Reddy',
          totalAmount: 10000,
          donationCount: 4,
          avatar: null,
          isAnonymous: false,
          badges: ['supporter'],
          lastDonation: '2024-01-25'
        },
        {
          id: '5',
          name: 'Sneha Patel',
          totalAmount: 8500,
          donationCount: 3,
          avatar: null,
          isAnonymous: false,
          badges: ['supporter'],
          lastDonation: '2024-01-24'
        }
      ],
      mostActiveDonors: [
        {
          id: '1',
          name: 'Priya Sharma',
          donationCount: 8,
          totalAmount: 25000,
          projectsSupported: 5,
          isAnonymous: false,
          badges: ['hero', 'generous']
        },
        {
          id: '2',
          name: 'Venkatesh Kumar',
          donationCount: 6,
          totalAmount: 15000,
          projectsSupported: 4,
          isAnonymous: false,
          badges: ['champion', 'generous']
        },
        {
          id: '6',
          name: 'Rahul Gupta',
          donationCount: 5,
          totalAmount: 7500,
          projectsSupported: 3,
          isAnonymous: false,
          badges: ['champion']
        },
        {
          id: '3',
          name: 'Anonymous Donor',
          donationCount: 4,
          totalAmount: 12000,
          projectsSupported: 2,
          isAnonymous: true,
          badges: ['supporter']
        },
        {
          id: '4',
          name: 'Anil Reddy',
          donationCount: 4,
          totalAmount: 10000,
          projectsSupported: 3,
          isAnonymous: false,
          badges: ['supporter']
        }
      ],
      biggestImpactDonors: [
        {
          id: '7',
          name: 'Rajesh Mehta',
          totalAmount: 50000,
          donationCount: 2,
          avgDonation: 25000,
          isAnonymous: false,
          badges: ['philanthropist', 'supporter']
        },
        {
          id: '8',
          name: 'Anonymous Philanthropist',
          totalAmount: 35000,
          donationCount: 3,
          avgDonation: 11667,
          isAnonymous: true,
          badges: ['generous', 'supporter']
        },
        {
          id: '1',
          name: 'Priya Sharma',
          totalAmount: 25000,
          donationCount: 8,
          avgDonation: 3125,
          isAnonymous: false,
          badges: ['hero', 'generous']
        },
        {
          id: '2',
          name: 'Venkatesh Kumar',
          totalAmount: 15000,
          donationCount: 6,
          avgDonation: 2500,
          isAnonymous: false,
          badges: ['champion', 'generous']
        },
        {
          id: '3',
          name: 'Anonymous Donor',
          totalAmount: 12000,
          donationCount: 4,
          avgDonation: 3000,
          isAnonymous: true,
          badges: ['supporter']
        }
      ]
    };
  }

  // Get leaderboard data with privacy settings
  getLeaderboard(category = 'topDonorsThisMonth', limit = 10) {
    const data = this.getMockLeaderboardData();
    const leaderboard = data[category] || [];
    
    return leaderboard.slice(0, limit).map((donor, index) => ({
      ...donor,
      rank: index + 1,
      displayName: donor.isAnonymous ? 'Anonymous Donor' : donor.name
    }));
  }

  // Get donor's position in leaderboard
  getDonorRank(donorId, category = 'topDonorsThisMonth') {
    const leaderboard = this.getLeaderboard(category, 100);
    const position = leaderboard.findIndex(donor => donor.id === donorId);
    return position >= 0 ? position + 1 : null;
  }

  // Get leaderboard stats
  getLeaderboardStats() {
    const data = this.getMockLeaderboardData();
    
    return {
      totalDonors: 150,
      totalDonations: 1247,
      totalAmount: 2500000,
      averageDonation: 2004,
      topDonorAmount: Math.max(...data.topDonorsThisMonth.map(d => d.totalAmount)),
      mostActiveDonorCount: Math.max(...data.mostActiveDonors.map(d => d.donationCount))
    };
  }

  // Filter leaderboard by time period
  getLeaderboardByPeriod(period = 'month') {
    // In a real app, this would filter by actual dates
    const data = this.getMockLeaderboardData();
    
    switch (period) {
      case 'week':
        return data.topDonorsThisMonth.slice(0, 3);
      case 'month':
        return data.topDonorsThisMonth;
      case 'year':
        return data.topDonorsThisMonth.map(donor => ({
          ...donor,
          totalAmount: donor.totalAmount * 8,
          donationCount: donor.donationCount * 6
        }));
      default:
        return data.topDonorsThisMonth;
    }
  }

  // Check if donor qualifies for leaderboard
  checkLeaderboardEligibility(donorStats) {
    const { donationCount, totalAmount } = donorStats;
    
    return {
      qualifiesForTop: totalAmount >= 1000,
      qualifiesForActive: donationCount >= 2,
      qualifiesForImpact: totalAmount >= 5000,
      suggestedGoal: this.getSuggestedGoal(donorStats)
    };
  }

  // Get suggested goal for donor
  getSuggestedGoal(donorStats) {
    const { donationCount, totalAmount } = donorStats;
    
    if (donationCount < 5) {
      return {
        type: 'count',
        target: 5,
        current: donationCount,
        message: `${5 - donationCount} more donations to reach Champion status!`
      };
    }
    
    if (totalAmount < 10000) {
      return {
        type: 'amount',
        target: 10000,
        current: totalAmount,
        message: `₹${(10000 - totalAmount).toLocaleString()} more to earn Generous Heart badge!`
      };
    }
    
    return {
      type: 'impact',
      message: 'Keep making a difference! You\'re already a top contributor.'
    };
  }
}

export default new LeaderboardService();