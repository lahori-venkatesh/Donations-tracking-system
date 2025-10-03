import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NGOVerificationBadge from '../components/verification/NGOVerificationBadge';
import TransparencyTracker from '../components/transparency/TransparencyTracker';
import ProjectManagement from '../components/ngo/ProjectManagement';
import NGOAnalytics from '../components/ngo/NGOAnalytics';

const NGODashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [ngoStats, setNgoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  // Mock NGO data - in real implementation, this would come from API
  const ngoData = {
    id: 'ngo_001',
    name: 'Asha Foundation',
    registrationNumber: 'REG/2015/NGO/001',
    panNumber: 'AABCA1234F',
    founded: '2015',
    address: '123 Anna Salai, Chennai, Tamil Nadu 600002',
    email: 'contact@ashafoundation.org',
    phone: '+91-9876-543210',
    website: 'https://ashafoundation.org',
    mission: 'To provide sustainable access to clean water and sanitation facilities in underserved communities across South India.',
    teamSize: 45,
    projectsCompleted: 127,
    beneficiariesServed: 25000,
    transparencyScore: 94,
    verification: {
      level: 'premium',
      verifiedDate: '2024-01-15T00:00:00Z',
      complianceScore: 94,
      fraudRiskScore: 12,
      badges: [
        { type: 'registered', label: 'Registered NGO', icon: 'shield-check', color: 'green' },
        { type: '80g_certified', label: '80G Certified', icon: 'certificate', color: 'blue' },
        { type: '12a_certified', label: '12A Certified', icon: 'award', color: 'purple' },
        { type: 'transparency_champion', label: 'Transparency Champion', icon: 'eye', color: 'yellow' }
      ]
    }
  };

  useEffect(() => {
    loadNGOStats();
  }, []);

  const loadNGOStats = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNgoStats({
        totalReceived: 187500,
        activeProjects: 12,
        totalBeneficiaries: 847,
        totalDonors: 156,
        pendingUpdates: 3,
        complianceScore: 94,
        transparencyScore: 96,
        monthlyGrowth: 15
      });
    } catch (error) {
      console.error('Error loading NGO stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      id: 'projects', 
      label: 'My Projects', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    { 
      id: 'transparency', 
      label: 'Transparency', 
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    },
    { 
      id: 'donations', 
      label: 'Donations', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    },
    { 
      id: 'beneficiaries', 
      label: 'Beneficiaries', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    { 
      id: 'verification', 
      label: 'Verification', 
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
  ];

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
                DonateTrack
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Verification Badge */}
              <NGOVerificationBadge ngo={ngoData} size="sm" />

              {/* Notification Bell */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto py-2">
                      <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-l-green-500">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New Donation Received</p>
                            <p className="text-sm text-gray-600">₹5,000 donation for Clean Water Initiative</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-l-yellow-500">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Update Required</p>
                            <p className="text-sm text-gray-600">Please upload progress update for Education project</p>
                            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-secondary-700 font-medium text-sm">
                      {ngoData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{ngoData.name}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-secondary-700 font-medium">
                            {ngoData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ngoData.name}</p>
                          <p className="text-sm text-gray-600">NGO Dashboard</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Organization Settings</span>
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
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
            ngoStats={ngoStats} 
            ngoData={ngoData}
          />
        )}
        
        {activeTab === 'projects' && (
          <ProjectsTab ngoData={ngoData} />
        )}
        
        {activeTab === 'transparency' && (
          <TransparencyTab ngoData={ngoData} />
        )}
        
        {activeTab === 'donations' && (
          <DonationsTab ngoData={ngoData} />
        )}
        
        {activeTab === 'beneficiaries' && (
          <BeneficiariesTab ngoData={ngoData} />
        )}
        
        {activeTab === 'verification' && (
          <VerificationTab ngoData={ngoData} />
        )}
        
        {activeTab === 'analytics' && (
          <NGOAnalytics ngoData={ngoData} />
        )}
        
        {activeTab === 'reports' && (
          <ReportsTab ngoData={ngoData} />
        )}
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ ngoStats, ngoData }) => (
  <div>
    {/* Welcome Section */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {ngoData.name}!
      </h1>
      <p className="text-gray-600">
        Manage your projects, track donations, and maintain transparency with your donors.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">₹{ngoStats?.totalReceived?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Received</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{ngoStats?.activeProjects}</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{ngoStats?.totalBeneficiaries}</p>
            <p className="text-sm text-gray-600">Beneficiaries</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{ngoStats?.totalDonors}</p>
            <p className="text-sm text-gray-600">Total Donors</p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <button className="card hover:shadow-lg transition-shadow duration-200 text-left">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">Create New Project</h3>
            <p className="text-sm text-gray-600">Start a new fundraising campaign</p>
          </div>
        </div>
      </button>

      <button className="card hover:shadow-lg transition-shadow duration-200 text-left">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">Upload Transparency Proof</h3>
            <p className="text-sm text-gray-600">Add receipts and impact documentation</p>
          </div>
        </div>
      </button>

      <button className="card hover:shadow-lg transition-shadow duration-200 text-left">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">Generate Report</h3>
            <p className="text-sm text-gray-600">Create impact and financial reports</p>
          </div>
        </div>
      </button>
    </div>

    {/* Dashboard Overview */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Projects */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Projects</h2>
        <div className="space-y-4">
          {[
            { 
              id: 1, 
              name: 'Clean Water Initiative - Tamil Nadu', 
              target: 50000, 
              raised: 32000, 
              donors: 24,
              category: 'Water',
              status: 'Active',
              urgency: 'high'
            },
            { 
              id: 2, 
              name: 'Education for All - Karnataka', 
              target: 80000, 
              raised: 65000, 
              donors: 45,
              category: 'Education',
              status: 'Active',
              urgency: 'medium'
            },
            { 
              id: 3, 
              name: 'Emergency Food Relief - Kerala', 
              target: 30000, 
              raised: 21000, 
              donors: 18,
              category: 'Food',
              status: 'Completed',
              urgency: 'low'
            },
          ].map((project) => (
            <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {project.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{project.donors} donors</p>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>₹{project.raised.toLocaleString()} raised</span>
                  <span>₹{project.target.toLocaleString()} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                    style={{ width: `${(project.raised / project.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { 
              id: 1, 
              action: 'New donation received', 
              details: '₹5,000 from Rajesh Kumar for Clean Water Initiative',
              time: '2 hours ago',
              type: 'donation'
            },
            { 
              id: 2, 
              action: 'Transparency proof uploaded', 
              details: 'Added receipt for water pump installation - ₹25,000',
              time: '5 hours ago',
              type: 'proof'
            },
            { 
              id: 3, 
              action: 'Project milestone achieved', 
              details: 'Education for All reached 80% funding goal',
              time: '1 day ago',
              type: 'milestone'
            },
            { 
              id: 4, 
              action: 'New beneficiaries registered', 
              details: 'Added 15 families to food relief program',
              time: '2 days ago',
              type: 'beneficiary'
            },
            { 
              id: 5, 
              action: 'Verification updated', 
              details: 'Compliance score improved to 94%',
              time: '3 days ago',
              type: 'verification'
            },
          ].map((activity) => (
            <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                  activity.type === 'donation' ? 'bg-green-500' :
                  activity.type === 'proof' ? 'bg-blue-500' :
                  activity.type === 'milestone' ? 'bg-purple-500' :
                  activity.type === 'beneficiary' ? 'bg-orange-500' :
                  'bg-indigo-500'
                }`}></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.action}</h3>
                  <p className="text-sm text-gray-700">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Projects Tab Component
const ProjectsTab = ({ ngoData }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProjectManagement, setShowProjectManagement] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Clean Water Initiative - Tamil Nadu',
      description: 'Providing clean drinking water to rural communities through well construction and water purification systems.',
      category: 'water',
      targetAmount: 50000,
      raisedAmount: 32000,
      donorsCount: 24,
      beneficiaries: 200,
      location: 'Rural Tamil Nadu',
      status: 'active',
      urgency: 'high',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Education for All - Karnataka',
      description: 'Building schools and providing educational materials for underprivileged children in remote areas.',
      category: 'education',
      targetAmount: 80000,
      raisedAmount: 65000,
      donorsCount: 45,
      beneficiaries: 150,
      location: 'Rural Karnataka',
      status: 'active',
      urgency: 'medium',
      startDate: '2024-01-10',
      endDate: '2024-04-20',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600">Manage your fundraising campaigns and track their progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-xl transition-all duration-300">
            {/* Project Image */}
            <div className="relative mb-4 -mx-6 -mt-6">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(project.urgency)}`}>
                  {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)} Priority
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{project.raisedAmount.toLocaleString()} raised</span>
                  <span>₹{project.targetAmount.toLocaleString()} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((project.raisedAmount / project.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{project.donorsCount} donors</span>
                  <span>{project.beneficiaries} beneficiaries</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    setSelectedProject(project);
                    setShowProjectManagement(true);
                  }}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  Manage Project
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={(projectData) => {
            setProjects([...projects, { ...projectData, id: Date.now() }]);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Project Management Modal */}
      {showProjectManagement && selectedProject && (
        <ProjectManagement
          project={selectedProject}
          onUpdate={(updatedProject) => {
            setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
            setShowProjectManagement(false);
            setSelectedProject(null);
          }}
          onClose={() => {
            setShowProjectManagement(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

// Transparency Tab Component
const TransparencyTab = ({ ngoData }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transparency Management</h2>
      <p className="text-gray-600">Upload proof of fund utilization and track your transparency score</p>
    </div>

    <TransparencyTracker 
      project={{
        id: 1,
        name: 'Clean Water Initiative - Tamil Nadu',
        ngo: ngoData.name
      }}
      donations={[
        { id: 1, amount: 5000, date: '2024-01-15', donor: 'Rajesh Kumar' },
        { id: 2, amount: 3000, date: '2024-01-20', donor: 'Priya Sharma' },
        { id: 3, amount: 2000, date: '2024-01-25', donor: 'Anonymous' }
      ]}
    />
  </div>
);

// Donations Tab Component
const DonationsTab = ({ ngoData }) => {
  const donations = [
    {
      id: 1,
      amount: 5000,
      donor: 'Rajesh Kumar',
      project: 'Clean Water Initiative - Tamil Nadu',
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'TXN123456789'
    },
    {
      id: 2,
      amount: 3000,
      donor: 'Priya Sharma',
      project: 'Education for All - Karnataka',
      date: '2024-01-20',
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN123456790'
    },
    {
      id: 3,
      amount: 2000,
      donor: 'Anonymous',
      project: 'Clean Water Initiative - Tamil Nadu',
      date: '2024-01-25',
      status: 'completed',
      paymentMethod: 'Net Banking',
      transactionId: 'TXN123456791'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Management</h2>
        <p className="text-gray-600">Track all donations received for your projects</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">₹{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Received</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{donations.length}</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">₹{Math.round(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Average Donation</div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.donor}</div>
                    <div className="text-sm text-gray-500">{donation.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">₹{donation.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{donation.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Beneficiaries Tab Component
const BeneficiariesTab = ({ ngoData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      name: 'Lakshmi Devi',
      age: 45,
      location: 'Thanjavur, Tamil Nadu',
      project: 'Clean Water Initiative',
      status: 'Active',
      joinDate: '2024-01-15',
      impact: 'Access to clean water for family of 5'
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      age: 12,
      location: 'Mysore, Karnataka',
      project: 'Education for All',
      status: 'Active',
      joinDate: '2024-01-20',
      impact: 'Enrolled in primary education program'
    }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Beneficiary Management</h2>
          <p className="text-gray-600">Track and manage people impacted by your projects</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Beneficiary
        </button>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="card">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {beneficiary.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{beneficiary.name}</h3>
                <p className="text-sm text-gray-600">Age: {beneficiary.age}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{beneficiary.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium">{beneficiary.project}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {beneficiary.status}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700">{beneficiary.impact}</p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 btn-secondary text-sm py-2">Edit</button>
              <button className="flex-1 btn-primary text-sm py-2">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Verification Tab Component
const VerificationTab = ({ ngoData }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Status</h2>
      <p className="text-gray-600">Manage your NGO verification and compliance status</p>
    </div>

    <NGOVerificationBadge ngo={ngoData} showDetails={true} size="lg" />
  </div>
);

// Reports Tab Component
const ReportsTab = ({ ngoData }) => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
      <p className="text-gray-600">Generate detailed reports for transparency and compliance</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Financial Report</h3>
          <p className="text-sm text-gray-600 mb-4">Detailed breakdown of donations and expenses</p>
          <button className="btn-primary w-full">Generate Report</button>
        </div>
      </div>

      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Impact Report</h3>
          <p className="text-sm text-gray-600 mb-4">Comprehensive impact assessment and metrics</p>
          <button className="btn-primary w-full">Generate Report</button>
        </div>
      </div>

      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Compliance Report</h3>
          <p className="text-sm text-gray-600 mb-4">Regulatory compliance and audit trail</p>
          <button className="btn-primary w-full">Generate Report</button>
        </div>
      </div>
    </div>
  </div>
);

// Create Project Modal Component
const CreateProjectModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'water',
    targetAmount: '',
    beneficiaries: '',
    location: '',
    urgency: 'medium',
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      beneficiaries: parseInt(formData.beneficiaries),
      raisedAmount: 0,
      donorsCount: 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe your project and its impact"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="water">Clean Water</option>
                <option value="education">Education</option>
                <option value="food">Food Relief</option>
                <option value="medical">Healthcare</option>
                <option value="shelter">Shelter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (₹)</label>
              <input
                type="number"
                required
                min="1000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Beneficiaries</label>
              <input
                type="number"
                required
                min="1"
                value={formData.beneficiaries}
                onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Rural Tamil Nadu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NGODashboard;