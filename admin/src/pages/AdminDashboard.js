import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminStats from '../components/AdminStats';
import UserManagement from '../components/UserManagement';
import ProjectManagement from '../components/ProjectManagement';
import DonationManagement from '../components/DonationManagement';
import VerificationQueue from '../components/VerificationQueue';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ReportsPanel from '../components/ReportsPanel';
import SystemSettings from '../components/SystemSettings';
import {
  ChartBarIcon,
  UsersIcon,
  FolderIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ChartPieIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout, API_BASE_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    activeUsers: 1247,
    serverLoad: 45
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todayDonations: 156,
    todayAmount: 45230,
    pendingApprovals: 12,
    activeAlerts: 3
  });

  const loadNotifications = useCallback(async () => {
    try {
      // Mock notifications for demo
      const mockNotifications = [
        {
          id: 1,
          type: 'verification',
          title: 'New NGO Verification',
          message: 'Hope Foundation submitted verification documents',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          priority: 'high',
          icon: '🏢'
        },
        {
          id: 2,
          type: 'fraud',
          title: 'Fraud Alert',
          message: 'Suspicious donation pattern detected - ₹50,000 from new account',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          priority: 'critical',
          icon: '⚠️'
        },
        {
          id: 3,
          type: 'system',
          title: 'System Update',
          message: 'Security patch applied successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          priority: 'low',
          icon: '🔧'
        },
        {
          id: 4,
          type: 'donation',
          title: 'Large Donation',
          message: 'Anonymous donor contributed ₹1,00,000 to Education Fund',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: false,
          priority: 'medium',
          icon: '💰'
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);

      // Mock recent activity
      const mockActivity = [
        { action: 'User Registration', details: 'New donor: Arjun Kumar', time: '2 min ago', type: 'user' },
        { action: 'Donation Received', details: '₹5,000 to Clean Water Project', time: '5 min ago', type: 'donation' },
        { action: 'Project Approved', details: 'Education Initiative by Learning Bridge', time: '12 min ago', type: 'project' },
        { action: 'NGO Verified', details: 'Green Earth Foundation completed verification', time: '25 min ago', type: 'verification' },
        { action: 'Report Generated', details: 'Monthly donation report exported', time: '1 hour ago', type: 'report' }
      ];

      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey) {
        const key = event.key;
        const shortcuts = {
          '1': 'overview',
          '2': 'users',
          '3': 'projects',
          '4': 'donations',
          '5': 'verification',
          '6': 'analytics',
          '7': 'reports',
          '8': 'settings'
        };
        
        if (shortcuts[key]) {
          event.preventDefault();
          setActiveTab(shortcuts[key]);
        }
        
        if (key === 'k') {
          event.preventDefault();
          document.querySelector('input[placeholder*="Search"]')?.focus();
        }
      }
      
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('[data-notifications]')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: ChartBarIcon,
      description: 'Real-time metrics & insights',
      color: 'blue',
      shortcut: '⌘1'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: UserGroupIcon,
      description: 'Manage all platform users',
      color: 'purple',
      shortcut: '⌘2',
      count: quickStats.activeUsers || 1247
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: BuildingOfficeIcon,
      description: 'Project oversight & approval',
      color: 'green',
      shortcut: '⌘3'
    },
    { 
      id: 'donations', 
      label: 'Donations', 
      icon: CurrencyDollarIcon,
      description: 'Transaction monitoring',
      color: 'emerald',
      shortcut: '⌘4',
      amount: `₹${(quickStats.todayAmount / 1000).toFixed(0)}K`
    },
    { 
      id: 'verification', 
      label: 'Verification', 
      icon: ShieldCheckIcon,
      description: 'Approval workflows',
      color: 'orange',
      shortcut: '⌘5',
      badge: quickStats.pendingApprovals || 12,
      urgent: quickStats.pendingApprovals > 10
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: ChartPieIcon,
      description: 'Advanced insights',
      color: 'indigo',
      shortcut: '⌘6'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: DocumentTextIcon,
      description: 'Data exports & reports',
      color: 'gray',
      shortcut: '⌘7'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Cog6ToothIcon,
      description: 'System configuration',
      color: 'slate',
      shortcut: '⌘8'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'users':
        return <UserManagement />;
      case 'projects':
        return <ProjectManagement />;
      case 'donations':
        return <DonationManagement />;
      case 'verification':
        return <VerificationQueue onUpdate={loadNotifications} />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Professional Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40 w-full">
        <div className="px-4 sm:px-6 lg:px-6 w-full">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <CommandLineIcon className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DonateTrack</h1>
                  <p className="text-xs text-gray-500 -mt-1">Admin Console</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full border border-blue-200">
                  Administrator
                </span>
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">{systemHealth.status}</span>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search users, projects, donations... (⌘K)"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <kbd className="inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-sans font-medium text-gray-400">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* System Health Indicator */}
              <div className="hidden lg:flex items-center space-x-4 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{systemHealth.uptime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{systemHealth.responseTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{systemHealth.activeUsers}</span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative" data-notifications>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50" data-notifications>
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <span className="text-sm text-gray-500">{unreadCount} unread</span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{notification.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  {notification.priority === 'critical' && (
                                    <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {notification.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-0 py-0">
        <div className="flex w-full">
          {/* Professional Sidebar Navigation */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 transition-all duration-300 ease-in-out`}>
            <div className="h-full bg-white border-r border-gray-200 shadow-sm">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                      }`}
                      title={sidebarCollapsed ? tab.label : ''}
                    >
                      {/* Background gradient for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20"></div>
                      )}
                      
                      <div className="flex items-center space-x-3 relative z-10">
                        <div className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-blue-50 group-hover:bg-blue-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-blue-600 group-hover:text-blue-700'
                          }`} />
                        </div>
                        
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-sm truncate ${
                                isActive ? 'text-white' : 'text-gray-900'
                              }`}>{tab.label}</span>
                              {tab.shortcut && !isActive && (
                                <kbd className="hidden lg:inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-mono text-gray-400">
                                  {tab.shortcut}
                                </kbd>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 truncate ${
                              isActive ? 'text-white/90' : 'text-gray-500 group-hover:text-gray-600'
                            }`}>
                              {tab.description}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="flex items-center space-x-2 relative z-10">
                          {tab.badge && (
                            <span className={`px-2 py-1 text-xs font-bold rounded-full animate-pulse ${
                              tab.urgent
                                ? 'bg-red-500 text-white'
                                : isActive 
                                  ? 'bg-white text-gray-900' 
                                  : 'bg-orange-100 text-orange-700'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                          {tab.count && (
                            <span className={`text-xs font-medium ${
                              isActive ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
                            </span>
                          )}
                          {tab.amount && (
                            <span className={`text-xs font-bold ${
                              isActive ? 'text-white' : 'text-green-600'
                            }`}>
                              {tab.amount}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Enhanced Quick Stats */}
              {!sidebarCollapsed && (
                <div className="p-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-900">Today's Overview</h3>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-gray-600">Donations</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{quickStats.todayDonations}</span>
                          <div className="text-xs text-green-600">₹{quickStats.todayAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-gray-600">Pending</span>
                        </div>
                        <span className="text-sm font-bold text-orange-600">{quickStats.pendingApprovals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-gray-600">Alerts</span>
                        </div>
                        <span className="text-sm font-bold text-red-600">{quickStats.activeAlerts}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">System Load</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${systemHealth.serverLoad}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{systemHealth.serverLoad}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Preview */}
                  <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {recentActivity.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'donation' ? 'bg-green-400' :
                            activity.type === 'user' ? 'bg-blue-400' :
                            activity.type === 'project' ? 'bg-purple-400' :
                            activity.type === 'verification' ? 'bg-orange-400' :
                            'bg-gray-400'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium truncate">{activity.action}</p>
                            <p className="text-gray-500 truncate">{activity.details}</p>
                          </div>
                          <span className="text-gray-400 text-xs">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex-1 min-w-0 bg-gray-50 w-full">
            <div className="h-full w-full">
              {/* Content Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {tabs.find(tab => tab.id === activeTab)?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Admin</span>
                      <span>/</span>
                      <span className="text-gray-900 font-medium">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                      </span>
                    </nav>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Export
                      </button>
                      <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        New
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-280px)] w-full">
                  {renderActiveComponent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;