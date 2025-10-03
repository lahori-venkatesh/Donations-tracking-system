// Badge Service for Donor Recognition System
export const BADGE_TYPES = {
  SUPPORTER: {
    id: 'supporter',
    name: 'Supporter',
    description: 'Made your first donation',
    icon: '🎉',
    requirement: 1,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion Donor',
    description: 'Made 5+ donations',
    icon: '💎',
    requirement: 5,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  HERO: {
    id: 'hero',
    name: 'Community Hero',
    description: 'Made 10+ donations',
    icon: '🏆',
    requirement: 10,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  LEGEND: {
    id: 'legend',
    name: 'Donation Legend',
    description: 'Made 25+ donations',
    icon: '⭐',
    requirement: 25,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  }
};

export const AMOUNT_BADGES = {
  GENEROUS: {
    id: 'generous',
    name: 'Generous Heart',
    description: 'Donated ₹10,000+',
    icon: '💝',
    requirement: 10000,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  PHILANTHROPIST: {
    id: 'philanthropist',
    name: 'Philanthropist',
    description: 'Donated ₹50,000+',
    icon: '👑',
    requirement: 50000,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700'
  }
};

class BadgeService {
  // Calculate badges based on donation count
  calculateCountBadges(donationCount) {
    const badges = [];
    
    Object.values(BADGE_TYPES).forEach(badge => {
      if (donationCount >= badge.requirement) {
        badges.push(badge);
      }
    });
    
    return badges.sort((a, b) => b.requirement - a.requirement);
  }

  // Calculate badges based on total amount
  calculateAmountBadges(totalAmount) {
    const badges = [];
    
    Object.values(AMOUNT_BADGES).forEach(badge => {
      if (totalAmount >= badge.requirement) {
        badges.push(badge);
      }
    });
    
    return badges.sort((a, b) => b.requirement - a.requirement);
  }

  // Get all badges for a donor
  getAllBadges(donationCount, totalAmount) {
    return [
      ...this.calculateCountBadges(donationCount),
      ...this.calculateAmountBadges(totalAmount)
    ];
  }

  // Get the highest badge
  getHighestBadge(donationCount, totalAmount) {
    const allBadges = this.getAllBadges(donationCount, totalAmount);
    return allBadges[0] || null;
  }

  // Check if donor earned a new badge
  checkNewBadge(previousCount, newCount, previousAmount, newAmount) {
    const previousBadges = this.getAllBadges(previousCount, previousAmount);
    const currentBadges = this.getAllBadges(newCount, newAmount);
    
    // Find newly earned badges
    const newBadges = currentBadges.filter(current => 
      !previousBadges.some(prev => prev.id === current.id)
    );
    
    return newBadges;
  }

  // Generate certificate data
  generateCertificate(donor, badge, project, ngo) {
    return {
      id: `cert_${Date.now()}`,
      donorName: donor.name,
      badgeName: badge.name,
      badgeIcon: badge.icon,
      projectName: project?.name || 'Multiple Projects',
      ngoName: ngo?.name || 'Various NGOs',
      dateEarned: new Date().toLocaleDateString(),
      totalDonations: donor.donationCount,
      totalAmount: donor.totalDonated,
      description: badge.description
    };
  }

  // Generate social sharing text
  generateSocialText(donor, badge, stats) {
    const templates = [
      `🎉 Just earned the ${badge.name} badge ${badge.icon} on DonateTrack! ${stats.donationCount} donations and counting. Making a difference, one donation at a time! #DonateTrack #Philanthropy`,
      `${badge.icon} Proud to be a ${badge.name}! ${stats.donationCount} donations across ${stats.projectCount} projects. Transparency in giving feels amazing! #TransparentDonations #DonateTrack`,
      `Milestone unlocked: ${badge.name} ${badge.icon}! ₹${stats.totalAmount.toLocaleString()} donated to create real impact. Join me in transparent giving! #DonateTrack #SocialImpact`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

export default new BadgeService();