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

const AnalyticsPanel = () => {
  const { API_BASE_URL } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockAnalytics = {
        overview: {
          totalRevenue: 12847563,
          totalDonations: 45623,
          averageDonation: 2815,
          conversionRate: 3.2,
          retentionRate: 68.5,
          fraudRate: 0.8
        },
        trends: {
          donations: [
            { date: '2024-01-01', value: 3200 },
            { date: '2024-01-02', value: 3800 },
            { date: '2024-01-03', value: 4200 },
            { date: '2024-01-04', value: 3900 },
            { date: '2024-01-05', value: 4500 },
            { date: '2024-01-06', value: 5100 },
            { date: '2024-01-07', value: 4800 }
          ]
        },
        categories: [
          { name: 'Education', donations: 12500, amount: 3200000, growth: 15.2 },
          { name: 'Healthcare', donations: 9800, amount: 2800000, growth: 12.8 },
          { name: 'Water', donations: 7200, amount: 1900000, growth: 18.5 },
          { name: 'Food', donations: 6100, amount: 1600000, growth: 8.3 }
        ]
      };

      setTimeout(() => {
        setAnalytics(mockAnalytics);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const trendData = {
    labels: analytics.trends.donations.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Donations',
        data: analytics.trends.donations.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const categoryData = {
    labels: analytics.categories.map(c => c.name),
    datasets: [
      {
        label: 'Donations',
        data: analytics.categories.map(c => c.donations),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderWidth: 0
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
    },
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Deep insights into platform performance</p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(analytics.overview.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Donation</p>
              <p className="text-2xl font-bold text-gray-900">₹{analytics.overview.averageDonation.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.retentionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fraud Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.fraudRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalDonations.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
          <Line data={trendData} options={chartOptions} />
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
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
      </div>

      {/* Category Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Performance Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.categories.map((category, index) => (
            <div key={index} className="text-center">
              <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
              <p className="text-2xl font-bold text-gray-900 mb-1">{category.donations.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mb-2">donations</p>
              <p className="text-lg font-semibold text-gray-900 mb-1">₹{(category.amount / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">+{category.growth}% growth</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;