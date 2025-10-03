import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BadgeCollection from '../components/badges/BadgeCollection';
import BadgeNotification from '../components/badges/BadgeNotification';
import LeaderboardCard from '../components/leaderboard/LeaderboardCard';
import SocialShareModal from '../components/social/SocialShareModal';
import CertificatesTab from '../components/certificates/CertificatesTab';
import NGOVerificationBadge from '../components/verification/NGOVerificationBadge';
import TransparencyTracker from '../components/transparency/TransparencyTracker';
import { donationAPI } from '../services/mockApi';
import badgeService from '../services/badgeService';
import verificationService from '../services/verificationService';

const DonorDashboard = ({ testUser }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = user || testUser;
  const [activeTab, setActiveTab] = useState('overview');
  const [donationStats, setDonationStats] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count

  useEffect(() => {
    loadDonationStats();
  }, [currentUser?.id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showNotifications]);

  const loadDonationStats = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getUserDonationStats(currentUser?.id || '1');
      setDonationStats(response.data);
    } catch (error) {
      console.error('Error loading donation stats:', error);
      // Fallback stats for demo
      setDonationStats({
        donationCount: 5,
        totalAmount: 20500,
        projectCount: 4,
        averageDonation: 4100
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = donationStats ? {
    totalDonated: donationStats.totalAmount,
    projectsSupported: donationStats.projectCount,
    donationCount: donationStats.donationCount,
    livesImpacted: Math.floor(donationStats.totalAmount / 150), // Rough calculation
    transparencyScore: 98
  } : {
    totalDonated: 20500,
    projectsSupported: 4,
    donationCount: 5,
    livesImpacted: 137,
    transparencyScore: 98
  };

  const recentDonations = [
    {
      id: 1,
      project: 'Clean Water Initiative - Tamil Nadu',
      amount: 5000,
      date: '2024-01-15',
      status: 'Active',
      impact: '25 families in rural Tamil Nadu gained access to clean water'
    },
    {
      id: 2,
      project: 'Education for All - Karnataka',
      amount: 3000,
      date: '2024-01-10',
      status: 'Completed',
      impact: '15 children in rural Karnataka received school supplies'
    },
    {
      id: 3,
      project: 'Healthcare Support - Kerala',
      amount: 2000,
      date: '2024-01-05',
      status: 'Active',
      impact: '10 medical checkups completed in rural Kerala'
    }
  ];

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'badges', 
      label: 'My Badges', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    { 
      id: 'donations', 
      label: 'My Donations', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    { 
      id: 'impact', 
      label: 'Impact Tracking', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      id: 'leaderboard', 
      label: 'Leaderboard', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'Discover Projects', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'certificates', 
      label: 'Tax Certificates', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
        </svg>
      )
    }
  ];

  const handleBadgeEarned = (badge) => {
    setNewBadge(badge);
  };

  const handleShareBadge = () => {
    setNewBadge(null);
    setShowShareModal(true);
  };

  const handleDonateClick = () => {
    setActiveTab('projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Donateto
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <img 
                    src="/bell-icon.png" 
                    alt="Notifications" 
                    className="w-6 h-6 filter hover:brightness-75 transition-all"
                  />
                  {/* Notification Badge */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    
                    {/* Notification Panel */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {notificationCount > 0 && (
                            <button
                              onClick={() => {
                                setNotificationCount(0);
                                // Add mark all as read logic here
                              }}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notification List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notificationCount > 0 ? (
                          <div className="py-2">
                            {/* Sample Notifications */}
                            <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-l-blue-500">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Donation Successful</p>
                                  <p className="text-sm text-gray-600">Your ₹5,000 donation to Clean Water Initiative has been processed successfully.</p>
                                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-l-green-500">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">New Badge Earned!</p>
                                  <p className="text-sm text-gray-600">Congratulations! You've earned the "Generous Donor" badge for your contributions.</p>
                                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-l-yellow-500">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Project Update</p>
                                  <p className="text-sm text-gray-600">Education for All project has reached 80% of its funding goal. Thank you for your support!</p>
                                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
                            </svg>
                            <p className="text-gray-500">No new notifications</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            // Add view all notifications logic here
                            alert('View all notifications coming soon!');
                          }}
                          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {currentUser?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileDropdown(false)}
                    ></div>
                    
                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 font-medium">
                              {currentUser?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{currentUser?.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Add profile settings logic here
                            alert('Profile settings coming soon!');
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Add account settings logic here
                            alert('Account settings coming soon!');
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Account Settings</span>
                        </button>


                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            // Add help/support logic here
                            alert('Help & Support coming soon!');
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Help & Support</span>
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Sign Out */}
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={stats} 
            recentDonations={recentDonations}
            onDonateClick={handleDonateClick}
            donationStats={donationStats}
          />
        )}
        
        {activeTab === 'badges' && (
          <BadgesTab 
            donationCount={stats.donationCount}
            totalAmount={stats.totalDonated}
            onBadgeEarned={handleBadgeEarned}
          />
        )}
        
        {activeTab === 'donations' && (
          <DonationsTab donations={recentDonations} />
        )}
        
        {activeTab === 'impact' && (
          <ImpactTab stats={stats} />
        )}
        
        {activeTab === 'leaderboard' && (
          <LeaderboardTab />
        )}
        
        {activeTab === 'projects' && (
          <ProjectsTab onDonateClick={handleDonateClick} setActiveTab={setActiveTab} />
        )}
        
        {activeTab === 'certificates' && (
          <CertificatesTab 
            donations={recentDonations}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Modals and Notifications */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
          onShare={handleShareBadge}
        />
      )}

      {showShareModal && (
        <SocialShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          badge={newBadge || badgeService.getHighestBadge(stats.donationCount, stats.totalDonated)}
          donorStats={stats}
          donorName={currentUser?.name}
        />
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, recentDonations, onDonateClick, donationStats }) => (
  <div>
    {/* Welcome Section */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back!
      </h1>
      <p className="text-gray-600">
        Track your donations and see the impact you're making in communities worldwide.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalDonated.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Donated</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{stats.livesImpacted}</p>
            <p className="text-sm text-gray-600">Lives Impacted</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{stats.projectsSupported}</p>
            <p className="text-sm text-gray-600">Projects Supported</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{stats.transparencyScore}%</p>
            <p className="text-sm text-gray-600">Transparency</p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Badge Preview */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Achievement Level</h2>
        <BadgeCollection 
          donationCount={stats.donationCount}
          totalAmount={stats.totalDonated}
          className="mb-0"
        />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h2>
        <div className="space-y-3">
          {recentDonations.slice(0, 3).map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{donation.project}</h3>
                <p className="text-sm text-gray-600">{donation.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{donation.amount.toLocaleString()}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {donation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onDonateClick} className="btn-primary w-full mt-4">
          Make New Donation
        </button>
      </div>
    </div>
  </div>
);

// Badges Tab Component
const BadgesTab = ({ donationCount, totalAmount, onBadgeEarned }) => (
  <div>
    <BadgeCollection 
      donationCount={donationCount}
      totalAmount={totalAmount}
    />
  </div>
);

// Donations Tab Component
const DonationsTab = ({ donations }) => (
  <div className="card">
    <h2 className="text-xl font-bold text-gray-900 mb-6">All Donations</h2>
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{donation.project}</h3>
              <p className="text-sm text-gray-600">{donation.date}</p>
              <p className="text-sm text-gray-500 mt-1">{donation.impact}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">₹{donation.amount.toLocaleString()}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {donation.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Impact Tab Component
const ImpactTab = ({ stats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Summary</h2>
      <div className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
          <div className="text-4xl font-bold text-primary-600 mb-2">{stats.livesImpacted}</div>
          <div className="text-gray-700">Lives Positively Impacted</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.projectsSupported}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.donationCount}</div>
            <div className="text-sm text-gray-600">Donations</div>
          </div>
        </div>
      </div>
    </div>

    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Transparency Score</h2>
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray={`${stats.transparencyScore}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{stats.transparencyScore}%</span>
          </div>
        </div>
        <p className="text-gray-600">Excellent transparency rating based on verified impact reports</p>
      </div>
    </div>
  </div>
);

// Leaderboard Tab Component
const LeaderboardTab = () => (
  <div>
    <LeaderboardCard />
  </div>
);

// Projects Tab Component
const ProjectsTab = ({ onDonateClick, setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: 'Clean Water Initiative',
      ngo: 'Asha Foundation',
      description: 'Providing clean drinking water to rural communities through well construction and water purification systems.',
      category: 'water',
      targetAmount: 5000,
      raisedAmount: 3200,
      donorsCount: 24,
      location: 'Rural Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop',
      urgency: 'high',
      endDate: '2024-03-15',
      beneficiaries: 200,
      status: 'active',
      ngoDetails: {
        founded: '2015',
        registration: 'REG/2015/NGO/001',
        registrationNumber: 'REG/2015/NGO/001',
        panNumber: 'AABCA1234F',
        tanNumber: 'CHEA12345F',
        website: 'https://ashafoundation.org',
        email: 'contact@ashafoundation.org',
        phone: '+91-9876-543210',
        address: '123 Anna Salai, Chennai, Tamil Nadu 600002',
        mission: 'To provide sustainable access to clean water and sanitation facilities in underserved communities across South India.',
        teamSize: 45,
        projectsCompleted: 127,
        beneficiariesServed: 25000,
        transparencyScore: 94,
        verification: {
          level: 'premium',
          verifiedDate: '2024-01-15T00:00:00Z',
          expiryDate: '2025-01-15T00:00:00Z',
          nextReviewDate: '2024-04-15T00:00:00Z',
          complianceScore: 94,
          fraudRiskScore: 12,
          documents: {
            ngo_registration_certificate: {
              verified: true,
              verifiedDate: '2024-01-15T00:00:00Z',
              registrationNumber: 'REG/2015/NGO/001'
            },
            pan_card: {
              verified: true,
              verifiedDate: '2024-01-15T00:00:00Z',
              panNumber: 'AABCA1234F'
            },
            '80g_certificate': {
              verified: true,
              verifiedDate: '2024-01-15T00:00:00Z',
              certificateNumber: '80G/2023/CHENNAI/001'
            },
            '12a_certificate': {
              verified: true,
              verifiedDate: '2024-01-15T00:00:00Z',
              certificateNumber: '12A/2023/CHENNAI/001'
            },
            audit_reports: {
              verified: true,
              verifiedDate: '2024-01-15T00:00:00Z',
              auditYear: 2023
            }
          },
          badges: [
            {
              type: 'registered',
              label: 'Registered NGO',
              icon: 'shield-check',
              color: 'green'
            },
            {
              type: '80g_certified',
              label: '80G Certified',
              icon: 'certificate',
              color: 'blue'
            },
            {
              type: '12a_certified',
              label: '12A Certified',
              icon: 'award',
              color: 'purple'
            },
            {
              type: 'transparency_champion',
              label: 'Transparency Champion',
              icon: 'eye',
              color: 'yellow'
            }
          ]
        },
        compliance: {
          annualReturnsFiled: true,
          auditReportsSubmitted: true,
          regularUpdates: true,
          financialTransparency: true,
          beneficiaryFeedback: true
        },
        auditTrail: [
          {
            timestamp: 1705276800000,
            action: 'NGO Registration Verified',
            description: 'Registration certificate verified through government database',
            hash: 'ABC123DEF456'
          },
          {
            timestamp: 1705363200000,
            action: '80G Certificate Validated',
            description: 'Tax exemption certificate validated with Income Tax Department',
            hash: 'DEF456GHI789'
          },
          {
            timestamp: 1705449600000,
            action: 'Annual Audit Report Submitted',
            description: 'FY 2022-23 audit report submitted and verified',
            hash: 'GHI789JKL012'
          }
        ]
      },
      teamMembers: [
        {
          name: 'Dr. Priya Krishnamurthy',
          role: 'Project Director',
          experience: '12 years',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Rajesh Subramanian',
          role: 'Field Coordinator',
          experience: '8 years',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Lakshmi Venkatesh',
          role: 'Community Liaison',
          experience: '6 years',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'This comprehensive water initiative focuses on drilling boreholes, installing solar-powered pumps, and establishing water committees in rural communities. The project includes training local technicians for maintenance and educating communities on water conservation and hygiene practices.',
      milestones: [
        { title: 'Site Survey Completed', date: '2024-01-15', status: 'completed' },
        { title: 'Community Meetings Held', date: '2024-01-30', status: 'completed' },
        { title: 'Drilling Equipment Secured', date: '2024-02-15', status: 'in-progress' },
        { title: 'Borehole Construction', date: '2024-03-01', status: 'pending' },
        { title: 'Pump Installation', date: '2024-03-10', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 2,
      name: 'Education for All',
      ngo: 'Vidya Foundation',
      description: 'Building schools and providing educational materials for underprivileged children in remote areas.',
      category: 'education',
      targetAmount: 8000,
      raisedAmount: 6500,
      donorsCount: 45,
      location: 'Rural Karnataka',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
      urgency: 'medium',
      endDate: '2024-04-20',
      beneficiaries: 150,
      status: 'active',
      ngoDetails: {
        founded: '2012',
        registration: 'REG/2012/EDU/002',
        website: 'https://vidyafoundation.org',
        email: 'info@vidyafoundation.org',
        phone: '+91-98765-43210',
        address: '456 MG Road, Bangalore, Karnataka 560001',
        mission: 'Bridging the education gap by providing quality learning opportunities to underprivileged children in rural and urban areas of South India.',
        teamSize: 32,
        projectsCompleted: 89,
        beneficiariesServed: 15000
      },
      teamMembers: [
        {
          name: 'Meera Nair',
          role: 'Education Director',
          experience: '15 years',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Arjun Reddy',
          role: 'Infrastructure Manager',
          experience: '10 years',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'Building modern classrooms with digital learning tools, training local teachers, and providing educational materials including books, tablets, and science equipment to enhance learning outcomes.',
      milestones: [
        { title: 'Land Acquisition', date: '2024-01-10', status: 'completed' },
        { title: 'Construction Started', date: '2024-02-01', status: 'completed' },
        { title: 'Teacher Training Program', date: '2024-03-15', status: 'in-progress' },
        { title: 'Equipment Installation', date: '2024-04-01', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 3,
      name: 'Emergency Food Relief',
      ngo: 'Annadana Trust',
      description: 'Providing emergency food packages to families affected by natural disasters and economic hardship.',
      category: 'food',
      targetAmount: 3000,
      raisedAmount: 2100,
      donorsCount: 18,
      location: 'Rural Andhra Pradesh',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
      urgency: 'critical',
      endDate: '2024-02-28',
      beneficiaries: 100,
      status: 'active',
      ngoDetails: {
        founded: '2018',
        registration: 'REG/2018/REL/003',
        website: 'https://annadanatrust.org',
        email: 'emergency@annadanatrust.org',
        phone: '+91-9876-123456',
        address: '789 Relief Road, Vijayawada, Andhra Pradesh 520001',
        mission: 'Providing rapid emergency response and relief to communities affected by natural disasters and humanitarian crises in South India.',
        teamSize: 28,
        projectsCompleted: 156,
        beneficiariesServed: 45000
      },
      teamMembers: [
        {
          name: 'Kavitha Rao',
          role: 'Emergency Response Coordinator',
          experience: '9 years',
          photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Suresh Naidu',
          role: 'Logistics Manager',
          experience: '7 years',
          photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'Emergency food relief program providing nutritious meal packages, clean water, and essential supplies to families displaced by recent typhoons and flooding in the region.',
      milestones: [
        { title: 'Needs Assessment', date: '2024-01-20', status: 'completed' },
        { title: 'Supply Procurement', date: '2024-02-01', status: 'completed' },
        { title: 'Distribution Centers Setup', date: '2024-02-15', status: 'in-progress' },
        { title: 'Food Package Distribution', date: '2024-02-25', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 4,
      name: 'Medical Equipment Drive',
      ngo: 'Arogya Seva Trust',
      description: 'Purchasing essential medical equipment for rural clinics and hospitals in underserved areas.',
      category: 'medical',
      targetAmount: 12000,
      raisedAmount: 4800,
      donorsCount: 32,
      location: 'Rural Kerala',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      urgency: 'high',
      endDate: '2024-05-10',
      beneficiaries: 500,
      status: 'active',
      ngoDetails: {
        founded: '2010',
        registration: 'REG/2010/MED/004',
        website: 'https://arogyasevatrust.org',
        email: 'medical@arogyasevatrust.org',
        phone: '+91-9876-345678',
        address: '321 Medical College Road, Kochi, Kerala 682011',
        mission: 'Improving healthcare access and quality in underserved communities through medical equipment provision and healthcare worker training across South India.',
        teamSize: 52,
        projectsCompleted: 203,
        beneficiariesServed: 75000
      },
      teamMembers: [
        {
          name: 'Dr. Ravi Menon',
          role: 'Medical Director',
          experience: '18 years',
          photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Deepika Pillai',
          role: 'Equipment Specialist',
          experience: '11 years',
          photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Dr. Anand Kumar',
          role: 'Training Coordinator',
          experience: '14 years',
          photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'Comprehensive medical equipment drive to equip rural clinics with essential diagnostic and treatment equipment, including X-ray machines, ultrasound devices, and laboratory equipment.',
      milestones: [
        { title: 'Equipment Specification', date: '2024-01-25', status: 'completed' },
        { title: 'Vendor Selection', date: '2024-02-10', status: 'completed' },
        { title: 'Equipment Procurement', date: '2024-03-15', status: 'in-progress' },
        { title: 'Installation & Training', date: '2024-04-20', status: 'pending' },
        { title: 'Quality Assurance', date: '2024-05-05', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 5,
      name: 'Shelter Reconstruction',
      ngo: 'Griha Nirman Trust',
      description: 'Rebuilding homes and community centers destroyed by recent natural disasters.',
      category: 'shelter',
      targetAmount: 15000,
      raisedAmount: 8900,
      donorsCount: 67,
      location: 'Rural Telangana',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
      urgency: 'medium',
      endDate: '2024-06-30',
      beneficiaries: 75,
      status: 'active',
      ngoDetails: {
        founded: '2016',
        registration: 'REG/2016/SHE/005',
        website: 'https://grihanirmantrust.org',
        email: 'rebuild@grihanirmantrust.org',
        phone: '+91-9876-456789',
        address: '456 Reconstruction Road, Hyderabad, Telangana 500001',
        mission: 'Rebuilding communities and restoring hope through sustainable housing and infrastructure reconstruction after natural disasters in South India.',
        teamSize: 38,
        projectsCompleted: 94,
        beneficiariesServed: 12000
      },
      teamMembers: [
        {
          name: 'Venkatesh Iyer',
          role: 'Construction Manager',
          experience: '16 years',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Sushma Reddy',
          role: 'Community Coordinator',
          experience: '12 years',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'Comprehensive shelter reconstruction program building earthquake-resistant homes and community centers using sustainable materials and local labor to support economic recovery.',
      milestones: [
        { title: 'Site Assessment', date: '2024-02-01', status: 'completed' },
        { title: 'Material Procurement', date: '2024-03-01', status: 'completed' },
        { title: 'Foundation Work', date: '2024-04-15', status: 'in-progress' },
        { title: 'Structure Construction', date: '2024-05-20', status: 'pending' },
        { title: 'Final Inspection', date: '2024-06-25', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 6,
      name: 'Solar Power for Schools',
      ngo: 'Surya Shakti Foundation',
      description: 'Installing solar panels in rural schools to provide reliable electricity for education.',
      category: 'education',
      targetAmount: 10000,
      raisedAmount: 7200,
      donorsCount: 41,
      location: 'Rural Puducherry',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      urgency: 'low',
      endDate: '2024-07-15',
      beneficiaries: 300,
      status: 'active',
      ngoDetails: {
        founded: '2014',
        registration: 'REG/2014/ENE/006',
        website: 'https://suryashaktifoundation.org',
        email: 'solar@suryashaktifoundation.org',
        phone: '+91-9876-567890',
        address: '789 Solar Street, Puducherry 605001',
        mission: 'Promoting sustainable energy solutions and environmental conservation through renewable energy projects in rural communities across South India.',
        teamSize: 29,
        projectsCompleted: 78,
        beneficiariesServed: 18000
      },
      teamMembers: [
        {
          name: 'Karthik Raman',
          role: 'Solar Engineer',
          experience: '13 years',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        {
          name: 'Divya Krishnan',
          role: 'Project Coordinator',
          experience: '8 years',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ],
      detailedDescription: 'Solar power installation project providing reliable electricity to rural schools, enabling extended learning hours, computer access, and improved educational outcomes for students.',
      milestones: [
        { title: 'Energy Assessment', date: '2024-02-20', status: 'completed' },
        { title: 'Solar Panel Procurement', date: '2024-03-25', status: 'completed' },
        { title: 'Installation Planning', date: '2024-05-01', status: 'in-progress' },
        { title: 'System Installation', date: '2024-06-15', status: 'pending' },
        { title: 'Training & Handover', date: '2024-07-10', status: 'pending' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=300&fit=crop'
      ]
    }
  ];

  const categories = [
    { 
      id: 'all', 
      name: 'All Projects', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'water', 
      name: 'Clean Water', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
        </svg>
      )
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'food', 
      name: 'Food Relief', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.846 1.846 0 003 15.546V9.75A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75v5.796z" />
        </svg>
      )
    },
    { 
      id: 'medical', 
      name: 'Healthcare', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      id: 'shelter', 
      name: 'Shelter', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleDonateFromDetails = () => {
    setShowProjectDetails(false);
    setShowDonationModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Projects</h2>
        <p className="text-gray-600">
          Find meaningful projects from verified NGOs and make a direct impact in communities worldwide.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects, NGOs, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Project Image */}
            <div className="relative mb-4 -mx-6 -mt-6">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(project.urgency)}`}>
                  {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)} Priority
                </span>
              </div>
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {project.location}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary-600 font-medium">{project.ngo}</p>
                  <NGOVerificationBadge ngo={project.ngoDetails} size="sm" />
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{project.raisedAmount.toLocaleString()} raised</span>
                  <span>₹{project.targetAmount.toLocaleString()} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${calculateProgress(project.raisedAmount, project.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{project.donorsCount} donors</span>
                  <span>{project.beneficiaries} beneficiaries</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleViewProject(project)}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleViewProject(project)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowProjectDetails(false);
            setSelectedProject(null);
          }}
          onDonate={handleDonateFromDetails}
        />
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedProject && (
        <DonationModal
          project={selectedProject}
          onClose={() => {
            setShowDonationModal(false);
            setSelectedProject(null);
          }}
          onSwitchToCertificates={() => setActiveTab('certificates')}
        />
      )}
    </div>
  );
};

// Project Details Modal Component
const ProjectDetailsModal = ({ project, onClose, onDonate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709' },
    { id: 'ngo', label: 'NGO Details', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'team', label: 'Team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'progress', label: 'Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'transparency', label: 'Transparency', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { id: 'gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(project.urgency)}`}>
                {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)} Priority
              </span>
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{project.location}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-white text-lg opacity-90">{project.ngo}</p>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                    </svg>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Donation Summary */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{project.raisedAmount.toLocaleString()} raised</span>
                  <span>₹{project.targetAmount.toLocaleString()} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${calculateProgress(project.raisedAmount, project.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{project.donorsCount} donors</span>
                  <span>{project.beneficiaries} beneficiaries</span>
                </div>
                <button
                  onClick={onDonate}
                  className="btn-primary w-full text-sm py-2"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-16rem)]">
            <div className="p-6">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{project.detailedDescription}</p>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Project Timeline</h3>
                      <p className="text-sm text-gray-600">End Date: {new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Impact Goal</h3>
                      <p className="text-sm text-gray-600">{project.beneficiaries} people will benefit</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'ngo' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {project.ngo}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{project.ngoDetails.mission}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Organization Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Founded:</span>
                          <span className="font-medium">{project.ngoDetails.founded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registration:</span>
                          <span className="font-medium">{project.ngoDetails.registration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team Size:</span>
                          <span className="font-medium">{project.ngoDetails.teamSize} members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Projects Completed:</span>
                          <span className="font-medium">{project.ngoDetails.projectsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">People Served:</span>
                          <span className="font-medium">{project.ngoDetails.beneficiariesServed.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <a href={project.ngoDetails.website} className="text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">
                            {project.ngoDetails.website}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${project.ngoDetails.email}`} className="text-primary-600 hover:text-primary-700">
                            {project.ngoDetails.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${project.ngoDetails.phone}`} className="text-primary-600 hover:text-primary-700">
                            {project.ngoDetails.phone}
                          </a>
                        </div>
                        <div className="flex items-start space-x-3">
                          <svg className="w-4 h-4 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600">{project.ngoDetails.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'team' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Team</h2>
                    <p className="text-gray-600 mb-6">Meet the dedicated professionals working on this project.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-primary-600 font-medium">{member.role}</p>
                            <p className="text-sm text-gray-500">{member.experience} experience</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'progress' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Progress</h2>
                    <p className="text-gray-600 mb-6">Track the milestones and current status of this project.</p>
                  </div>

                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                          <p className="text-sm text-gray-600">{new Date(milestone.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'transparency' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency & Accountability</h2>
                    <p className="text-gray-600 mb-6">Real-time tracking of fund utilization and project impact with third-party verification.</p>
                  </div>

                  <TransparencyTracker 
                    project={project} 
                    donations={[
                      { id: 1, amount: 5000, date: '2024-01-15', donor: 'Anonymous' },
                      { id: 2, amount: 3000, date: '2024-01-20', donor: 'Rajesh Kumar' },
                      { id: 3, amount: 2000, date: '2024-01-25', donor: 'Priya Sharma' }
                    ]} 
                  />
                </div>
              )}

              {activeSection === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Gallery</h2>
                    <p className="text-gray-600 mb-6">Visual documentation of the project and its impact.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Donation Modal Component
const DonationModal = ({ project, onClose, onSwitchToCertificates }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setDonationAmount(e.target.value);
  };

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    
    // Simulate donation processing
    setTimeout(() => {
      setLoading(false);
      
      // Show success message with certificate option
      const generateCertificate = window.confirm(
        `Thank you for your ₹${donationAmount} donation to ${project.name}!\n\nWould you like to generate a tax certificate now?`
      );
      
      if (generateCertificate && onSwitchToCertificates) {
        // Switch to certificates tab after closing modal
        setTimeout(() => {
          onSwitchToCertificates();
        }, 500);
      }
      
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a Donation</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.ngo}</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>₹{project.raisedAmount.toLocaleString()} raised</span>
                <span>₹{project.targetAmount.toLocaleString()} goal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((project.raisedAmount / project.targetAmount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Predefined Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose an amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    donationAmount === amount.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">₹{amount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="customAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                min="1"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Leave a message of support..."
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Make this donation anonymous
            </label>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={loading || !donationAmount || parseFloat(donationAmount) <= 0}
            className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              `Donate ₹${donationAmount || '0'}`
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-1">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-500">
              Your donation is secure and will be processed safely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;