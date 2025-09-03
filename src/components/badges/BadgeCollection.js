import React from 'react';
import BadgeDisplay from './BadgeDisplay';
import badgeService from '../../services/badgeService';

const BadgeCollection = ({ donationCount, totalAmount, className = '' }) => {
  const badges = badgeService.getAllBadges(donationCount, totalAmount);
  const highestBadge = badgeService.getHighestBadge(donationCount, totalAmount);

  if (badges.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Your Journey</h3>
        <p className="text-gray-500">Make your first donation to earn your Supporter badge!</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Badges</h3>
          <p className="text-gray-600">Earned through your generous contributions</p>
        </div>
        {highestBadge && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Level</div>
            <div className="flex items-center space-x-2">
              <BadgeDisplay badge={highestBadge} size="sm" showTooltip={false} />
              <span className="font-semibold text-gray-900">{highestBadge.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className={`
            ${badge.bgColor} 
            rounded-xl p-4 text-center
            border-2 border-transparent
            hover:border-gray-200
            transition-all duration-200
          `}>
            <BadgeDisplay 
              badge={badge} 
              size="lg" 
              showTooltip={false}
              className="mx-auto mb-3"
            />
            <h4 className={`font-semibold ${badge.textColor} mb-1`}>
              {badge.name}
            </h4>
            <p className="text-xs text-gray-600">
              {badge.description}
            </p>
          </div>
        ))}
      </div>

      {/* Progress to next badge */}
      <NextBadgeProgress 
        donationCount={donationCount} 
        totalAmount={totalAmount}
        className="mt-6"
      />
    </div>
  );
};

const NextBadgeProgress = ({ donationCount, totalAmount, className = '' }) => {
  const allBadges = { ...badgeService.BADGE_TYPES, ...badgeService.AMOUNT_BADGES };
  const currentBadges = badgeService.getAllBadges(donationCount, totalAmount);
  const currentBadgeIds = currentBadges.map(b => b.id);
  
  // Find next badge to earn
  const nextBadge = Object.values(allBadges).find(badge => 
    !currentBadgeIds.includes(badge.id) && 
    (badge.requirement > donationCount || badge.requirement > totalAmount)
  );

  if (!nextBadge) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h4 className="font-bold text-purple-900 mb-2">Badge Master!</h4>
        <p className="text-purple-700">You've earned all available badges. Keep donating to maintain your impact!</p>
      </div>
    );
  }

  const isCountBased = Object.values(badgeService.BADGE_TYPES).includes(nextBadge);
  const progress = isCountBased 
    ? (donationCount / nextBadge.requirement) * 100
    : (totalAmount / nextBadge.requirement) * 100;
  
  const remaining = isCountBased 
    ? nextBadge.requirement - donationCount
    : nextBadge.requirement - totalAmount;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Next Badge</h4>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{nextBadge.icon}</span>
            </div>
            <span className="font-semibold text-blue-800">{nextBadge.name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-600">
            {isCountBased 
              ? `${remaining} more donations`
              : `₹${remaining.toLocaleString()} more`
            }
          </div>
        </div>
      </div>
      
      <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-blue-700">
        {Math.round(progress)}% complete
      </div>
    </div>
  );
};

export default BadgeCollection;