import React, { useState } from 'react';

const NGOAnalytics = ({ ngoData }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeMetric, setActiveMetric] = useState('donations');

  // Mock analytics data
  const analyticsData = {
    donations: {
      total: 187500,
      growth: 15.2,
      trend: 'up',
      data: [
        { period: 'Jan', value: 45000 },
        { period: 'Feb', value: 52000 },
        { period: 'Mar', value: 48000 },
        { period: 'Apr', value: 42500 }
      ]
    },
    donors: {
      total: 156,
      growth: 8.7,
      trend: 'up',
      data: [
        { period: 'Jan', value: 35 },
        { period: 'Feb', value: 42 },
        { period: 'Mar', value: 38 },
        { period: 'Apr', value: 41 }
      ]
    },
    projects: {
      total: 12,
      growth: 20.0,
      trend: 'up',
      data: [
        { period: 'Jan', value: 8 },
        { period: 'Feb', value: 10 },
        { period: 'Mar', value: 11 },
        { period: 'Apr', value: 12 }
      ]
    },
    beneficiaries: {
      total: 847,
      growth: 12.5,
      trend: 'up',
      data: [
        { period: 'Jan', value: 650 },
        { period: 'Feb', value: 720 },
        { period: 'Mar', value: 780 },
        { period: 'Apr', value: 847 }
      ]
    }
  };

  const metrics = [
    {
      id: 'donations',
      label: 'Total Donations',
      value: `₹${analyticsData.donations.total.toLocaleString()}`,
      growth: analyticsData.donations.growth,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2',
      color: 'green'
    },
    {
      id: 'donors',
      label: 'Active Donors',
      value: analyticsData.donors.total.toString(),
      growth: analyticsData.donors.growth,
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'blue'
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: analyticsData.projects.total.toString(),
      growth: analyticsData.projects.growth,
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'purple'
    },
    {
      id: 'beneficiaries',
      label: 'Beneficiaries',
      value: analyticsData.beneficiaries.total.toString(),
      growth: analyticsData.beneficiaries.growth,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your NGO's performance and impact metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={`card cursor-pointer transition-all duration-200 ${
              activeMetric === metric.id ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <svg className={`w-4 h-4 mr-1 ${metric.growth >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.growth >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                  </svg>
                  <span className={`text-sm font-medium ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metric.growth)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {metrics.find(m => m.id === activeMetric)?.label} Trend
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Current Period</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData[activeMetric].data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all duration-300 hover:bg-primary-600"
                  style={{
                    height: `${(item.value / Math.max(...analyticsData[activeMetric].data.map(d => d.value))) * 200}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="mt-2 text-sm text-gray-600">{item.period}</div>
                <div className="text-xs font-medium text-gray-900">
                  {activeMetric === 'donations' ? `₹${item.value.toLocaleString()}` : item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-900">Donation Growth</p>
                <p className="text-sm text-green-700">15.2% increase in donations this month</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900">Donor Retention</p>
                <p className="text-sm text-blue-700">78% of donors made repeat donations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-purple-900">Project Success</p>
                <p className="text-sm text-purple-700">92% of projects reached funding goals</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-orange-900">Impact Reach</p>
                <p className="text-sm text-orange-700">847 beneficiaries served this quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Projects */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
          <div className="space-y-3">
            {[
              { name: 'Clean Water Initiative', raised: 32000, target: 50000, donors: 24 },
              { name: 'Education for All', raised: 65000, target: 80000, donors: 45 },
              { name: 'Food Relief Program', raised: 21000, target: 30000, donors: 18 }
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full" 
                        style={{ width: `${(project.raised / project.target) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{Math.round((project.raised / project.target) * 100)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₹{project.raised.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{project.donors} donors</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donor Demographics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Demographics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 18-30</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 31-45</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Age 46+</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New donation', details: '₹5,000 received', time: '2 hours ago', type: 'donation' },
              { action: 'Project milestone', details: 'Water project 80% complete', time: '5 hours ago', type: 'milestone' },
              { action: 'Transparency update', details: 'Receipt uploaded', time: '1 day ago', type: 'transparency' },
              { action: 'New beneficiary', details: '15 families added', time: '2 days ago', type: 'beneficiary' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'donation' ? 'bg-green-500' :
                  activity.type === 'milestone' ? 'bg-blue-500' :
                  activity.type === 'transparency' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparency Score */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Transparency Score</h3>
            <p className="text-gray-600">Your organization's transparency rating</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{ngoData.transparencyScore}%</div>
            <div className="text-sm text-gray-600">Excellent</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-sm text-green-700">Financial Reports</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <div className="text-sm text-blue-700">Project Updates</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-purple-700">Impact Documentation</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">88%</div>
            <div className="text-sm text-orange-700">Beneficiary Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOAnalytics;