import React, { useState } from 'react';
import BadgeDisplay from '../badges/BadgeDisplay';
import leaderboardService from '../../services/leaderboardService';

const LeaderboardCard = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('amount');
  const [timePeriod, setTimePeriod] = useState('month');

  const tabs = [
    { 
      id: 'amount', 
      label: 'Top Donors', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    { 
      id: 'count', 
      label: 'Most Active', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 'impact', 
      label: 'Biggest Impact', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  const getLeaderboardData = () => {
    switch (activeTab) {
      case 'amount':
        return leaderboardService.getLeaderboard('topDonorsThisMonth', 5);
      case 'count':
        return leaderboardService.getLeaderboard('mostActiveDonors', 5);
      case 'impact':
        return leaderboardService.getLeaderboard('biggestImpactDonors', 5);
      default:
        return [];
    }
  };

  const leaderboardData = getLeaderboardData();

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
      case 2: return (
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
      case 3: return (
        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50';
      case 2: return 'text-gray-600 bg-gray-50';
      case 3: return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`card rounded-2xl shadow-xl bg-white overflow-hidden ${className}`}>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Donor Leaderboard</h3>
            <p className="text-sm text-gray-500 mt-1">Celebrating our amazing donors</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 rounded-full p-1.5 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center justify-center space-x-2 py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                ${activeTab === tab.id 
                  ? 'bg-white text-primary-600 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }
              `}
            >
              {tab.icon}
              <span className="ml-1">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Time Period Selector */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setTimePeriod(period.id)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap shadow-sm
                ${timePeriod === period.id 
                  ? 'bg-primary-100 text-primary-700 scale-105' 
                  : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                }
              `}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          {leaderboardData.map((donor) => (
            <div
              key={donor.id}
              className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Rank */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm
                ${getRankColor(donor.rank)}
              `}>
                {typeof getRankIcon(donor.rank) === 'string' 
                  ? getRankIcon(donor.rank)
                  : getRankIcon(donor.rank)
                }
              </div>

              {/* Avatar */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                <span className="text-white font-semibold text-base">
                  {donor.isAnonymous ? '?' : donor.displayName.charAt(0)}
                </span>
              </div>

              {/* Donor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900 truncate text-lg">
                    {donor.displayName}
                  </h4>
                  {donor.badges && donor.badges.length > 0 && (
                    <div className="flex space-x-1">
                      {donor.badges.slice(0, 2).map((badgeId) => (
                        <BadgeDisplay 
                          key={badgeId}
                          badge={{ id: badgeId }} 
                          size="sm" 
                          showTooltip={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {activeTab === 'amount' && (
                    <>₹{donor.totalAmount?.toLocaleString()} • {donor.donationCount} donations</>
                  )}
                  {activeTab === 'count' && (
                    <>{donor.donationCount} donations • {donor.projectsSupported} projects</>
                  )}
                  {activeTab === 'impact' && (
                    <>₹{donor.totalAmount?.toLocaleString()} • Avg: ₹{donor.avgDonation?.toLocaleString()}</>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                {activeTab === 'amount' && (
                  <div className="text-xl font-bold text-primary-600">
                    ₹{donor.totalAmount?.toLocaleString()}
                  </div>
                )}
                {activeTab === 'count' && (
                  <div className="text-xl font-bold text-secondary-600">
                    {donor.donationCount}
                  </div>
                )}
                {activeTab === 'impact' && (
                  <div className="text-xl font-bold text-accent-600">
                    ₹{donor.avgDonation?.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View Full Leaderboard */}
        <div className="mt-8 text-center">
          <button className="w-full py-3 px-6 rounded-full text-sm font-medium bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-all duration-300 shadow-md hover:shadow-lg">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
