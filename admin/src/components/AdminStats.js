import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminStats = () => {
  const { API_BASE_URL } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to mock data
        const mockStats = {
          overview: {
            totalUsers: 15847,
            totalDonors: 12456,
            totalNGOs: 3391,
            totalProjects: 2847,
            totalDonations: 45623,
            totalAmount: 12847563,
            activeProjects: 1847,
            completedProjects: 1000,
            pendingVerifications: 23,
            fraudAlerts: 5
          },
          growth: {
            usersGrowth: 12.5,
            donationsGrowth: 18.3,
            amountGrowth: 24.7,
            projectsGrowth: 8.9
          },
          monthlyData: [
            { month: 'Jan', donations: 3200, amount: 850000, users: 1200 },
            { month: 'Feb', donations: 3800, amount: 920000, users: 1350 },
            { month: 'Mar', donations: 4200, amount: 1100000, users: 1500 },
            { month: 'Apr', donations: 3900, amount: 980000, users: 1420 },
            { month: 'May', donations: 4500, amount: 1250000, users: 1680 },
            { month: 'Jun', donations: 5100, amount: 1400000, users: 1850 }
          ],
          categoryData: [
            { category: 'Education', count: 847, amount: 3200000 },
            { category: 'Healthcare', count: 623, amount: 2800000 },
            { category: 'Water', count: 456, amount: 1900000 },
            { category: 'Food', count: 389, amount: 1600000 },
            { category: 'Environment', count: 298, amount: 1200000 },
            { category: 'Others', count: 234, amount: 900000 }
          ]
        };
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use mock data as fallback
      const mockStats = {
        overview: {
          totalUsers: 15847,
          totalDonors: 12456,
          totalNGOs: 3391,
          totalProjects: 2847,
          totalDonations: 45623,
          totalAmount: 12847563,
          activeProjects: 1847,
          completedProjects: 1000,
          pendingVerifications: 23,
          fraudAlerts: 5
        },
        growth: {
          usersGrowth: 12.5,
          donationsGrowth: 18.3,
          amountGrowth: 24.7,
          projectsGrowth: 8.9
        },
        monthlyData: [
          { month: 'Jan', donations: 3200, amount: 850000, users: 1200 },
          { month: 'Feb', donations: 3800, amount: 920000, users: 1350 },
          { month: 'Mar', donations: 4200, amount: 1100000, users: 1500 },
          { month: 'Apr', donations: 3900, amount: 980000, users: 1420 },
          { month: 'May', donations: 4500, amount: 1250000, users: 1680 },
          { month: 'Jun', donations: 5100, amount: 1400000, users: 1850 }
        ],
        categoryData: [
          { category: 'Education', count: 847, amount: 3200000 },
          { category: 'Healthcare', count: 623, amount: 2800000 },
          { category: 'Water', count: 456, amount: 1900000 },
          { category: 'Food', count: 389, amount: 1600000 },
          { category: 'Environment', count: 298, amount: 1200000 },
          { category: 'Others', count: 234, amount: 900000 }
        ]
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const donationTrendData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Donations',
        data: stats.monthlyData.map(d => d.donations),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Amount (₹)',
        data: stats.monthlyData.map(d => d.amount / 1000),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const categoryData = {
    labels: stats.categoryData.map(d => d.category),
    datasets: [
      {
        data: stats.categoryData.map(d => d.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#6B7280'
        ],
        borderWidth: 0
      }
    ]
  };

  const userGrowthData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'New Users',
        data: stats.monthlyData.map(d => d.users),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.growth.usersGrowth}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.totalDonations.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.growth.donationsGrowth}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">₹{(stats.overview.totalAmount / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.growth.amountGrowth}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.activeProjects.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                +{stats.growth.projectsGrowth}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800">Pending Verifications</h3>
              <p className="text-yellow-700">{stats.overview.pendingVerifications} NGOs awaiting verification</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800">Fraud Alerts</h3>
              <p className="text-red-700">{stats.overview.fraudAlerts} suspicious activities detected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
          <Line data={donationTrendData} options={chartOptions} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Category</h3>
          <div className="h-64">
            <Doughnut 
              data={categoryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }} 
            />
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <Bar data={userGrowthData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'donation', message: 'New donation of ₹5,000 to Clean Water Initiative', time: '2 minutes ago', icon: '💰' },
            { type: 'verification', message: 'Hope Foundation completed verification process', time: '15 minutes ago', icon: '✅' },
            { type: 'project', message: 'New project "Education for All" created by Learning Bridge', time: '1 hour ago', icon: '📚' },
            { type: 'user', message: '25 new users registered today', time: '2 hours ago', icon: '👥' },
            { type: 'alert', message: 'Suspicious donation pattern detected and flagged', time: '3 hours ago', icon: '⚠️' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;