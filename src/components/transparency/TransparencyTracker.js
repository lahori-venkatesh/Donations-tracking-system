import React, { useState, useEffect } from 'react';

const TransparencyTracker = ({ project, donations = [] }) => {
  const [activeTab, setActiveTab] = useState('utilization');
  const [proofDocuments, setProofDocuments] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);

  useEffect(() => {
    // Load transparency data for the project
    loadTransparencyData();
  }, [project.id]);

  const loadTransparencyData = async () => {
    // Mock data - in real implementation, this would come from API
    setProofDocuments([
      {
        id: 1,
        type: 'receipt',
        title: 'Water Pump Purchase Receipt',
        description: 'Receipt for solar water pump system',
        amount: 45000,
        date: '2024-01-20',
        category: 'equipment',
        verified: true,
        document: 'receipt_001.pdf',
        uploadedBy: 'Project Manager',
        verifiedBy: 'Finance Team'
      },
      {
        id: 2,
        type: 'invoice',
        title: 'Construction Materials Invoice',
        description: 'Cement, steel, and other construction materials',
        amount: 25000,
        date: '2024-01-25',
        category: 'materials',
        verified: true,
        document: 'invoice_002.pdf',
        uploadedBy: 'Site Engineer',
        verifiedBy: 'Procurement Team'
      },
      {
        id: 3,
        type: 'photo',
        title: 'Installation Progress Photos',
        description: 'Before and after photos of water pump installation',
        amount: 0,
        date: '2024-02-01',
        category: 'progress',
        verified: true,
        document: 'progress_photos.zip',
        uploadedBy: 'Field Coordinator',
        verifiedBy: 'Project Director'
      }
    ]);

    setProgressUpdates([
      {
        id: 1,
        title: 'Project Initiation',
        description: 'Site survey completed and community meetings conducted',
        date: '2024-01-15',
        status: 'completed',
        impact: 'Identified optimal locations for water sources',
        beneficiaries: 200,
        photos: ['survey1.jpg', 'meeting1.jpg'],
        expenditure: 5000,
        category: 'planning'
      },
      {
        id: 2,
        title: 'Equipment Procurement',
        description: 'Solar water pumps and filtration systems purchased',
        date: '2024-01-20',
        status: 'completed',
        impact: 'High-quality equipment secured for long-term sustainability',
        beneficiaries: 200,
        photos: ['equipment1.jpg', 'equipment2.jpg'],
        expenditure: 45000,
        category: 'procurement'
      },
      {
        id: 3,
        title: 'Installation Phase',
        description: 'Water pump installation and testing in progress',
        date: '2024-02-01',
        status: 'in-progress',
        impact: 'First water source now operational, serving 50 families',
        beneficiaries: 50,
        photos: ['install1.jpg', 'install2.jpg'],
        expenditure: 15000,
        category: 'implementation'
      }
    ]);
  };

  const calculateUtilizationPercentage = () => {
    const totalReceived = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalSpent = proofDocuments.reduce((sum, doc) => sum + doc.amount, 0);
    return totalReceived > 0 ? Math.round((totalSpent / totalReceived) * 100) : 0;
  };

  const getCategoryColor = (category) => {
    const colors = {
      equipment: 'bg-blue-100 text-blue-800',
      materials: 'bg-green-100 text-green-800',
      progress: 'bg-purple-100 text-purple-800',
      planning: 'bg-yellow-100 text-yellow-800',
      procurement: 'bg-indigo-100 text-indigo-800',
      implementation: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    {
      id: 'utilization',
      label: 'Fund Utilization',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    },
    {
      id: 'progress',
      label: 'Progress Updates',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      id: 'impact',
      label: 'Impact Measurement',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    },
    {
      id: 'verification',
      label: 'Third-Party Verification',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transparency Tracker</h3>
            <p className="text-gray-600">Real-time fund utilization and impact tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateUtilizationPercentage()}%</div>
              <div className="text-xs text-gray-500">Funds Utilized</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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

      {/* Content */}
      <div className="p-6">
        {activeTab === 'utilization' && (
          <UtilizationTab 
            proofDocuments={proofDocuments} 
            donations={donations}
            getCategoryColor={getCategoryColor}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressTab 
            progressUpdates={progressUpdates}
            getStatusColor={getStatusColor}
            getCategoryColor={getCategoryColor}
          />
        )}
        {activeTab === 'impact' && (
          <ImpactTab project={project} progressUpdates={progressUpdates} />
        )}
        {activeTab === 'verification' && (
          <VerificationTab project={project} />
        )}
      </div>
    </div>
  );
};

const UtilizationTab = ({ proofDocuments, donations, getCategoryColor }) => {
  const totalReceived = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalSpent = proofDocuments.reduce((sum, doc) => sum + doc.amount, 0);
  const remainingFunds = totalReceived - totalSpent;

  return (
    <div className="space-y-6">
      {/* Fund Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">₹{totalReceived.toLocaleString()}</div>
          <div className="text-sm text-blue-700">Total Received</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</div>
          <div className="text-sm text-green-700">Total Spent</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">₹{remainingFunds.toLocaleString()}</div>
          <div className="text-sm text-yellow-700">Remaining</div>
        </div>
      </div>

      {/* Proof Documents */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Proof of Utilization</h4>
        <div className="space-y-4">
          {proofDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="font-medium text-gray-900">{doc.title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                    {doc.verified && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Amount: ₹{doc.amount.toLocaleString()}</span>
                    <span>Date: {new Date(doc.date).toLocaleDateString('en-IN')}</span>
                    <span>Uploaded by: {doc.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Document
                  </button>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgressTab = ({ progressUpdates, getStatusColor, getCategoryColor }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Project Progress Timeline</h4>
    
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-6">
        {progressUpdates.map((update, index) => (
          <div key={update.id} className="relative flex items-start space-x-4">
            {/* Timeline dot */}
            <div className={`
              relative z-10 w-12 h-12 rounded-full flex items-center justify-center
              ${update.status === 'completed' ? 'bg-green-100' : 
                update.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'}
            `}>
              <svg className={`
                w-6 h-6
                ${update.status === 'completed' ? 'text-green-600' : 
                  update.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'}
              `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  update.status === 'completed' ? 'M5 13l4 4L19 7' :
                  update.status === 'in-progress' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' :
                  'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                } />
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{update.title}</h5>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                    {update.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(update.category)}`}>
                    {update.category}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{update.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Impact:</span>
                  <p className="font-medium text-gray-900">{update.impact}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Beneficiaries:</span>
                  <p className="font-medium text-gray-900">{update.beneficiaries} people</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Expenditure:</span>
                  <p className="font-medium text-gray-900">₹{update.expenditure.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Date: {new Date(update.date).toLocaleDateString('en-IN')}</span>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View Photos ({update.photos.length})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ImpactTab = ({ project, progressUpdates }) => {
  const totalBeneficiaries = progressUpdates.reduce((sum, update) => Math.max(sum, update.beneficiaries), 0);
  const completedUpdates = progressUpdates.filter(update => update.status === 'completed').length;
  const totalUpdates = progressUpdates.length;
  const completionRate = totalUpdates > 0 ? Math.round((completedUpdates / totalUpdates) * 100) : 0;

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900">Impact Measurement</h4>
      
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{totalBeneficiaries}</div>
          <div className="text-sm text-blue-700">People Impacted</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-sm text-green-700">Completion Rate</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{completedUpdates}</div>
          <div className="text-sm text-purple-700">Milestones Achieved</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">98%</div>
          <div className="text-sm text-yellow-700">Transparency Score</div>
        </div>
      </div>

      {/* Impact Chart Placeholder */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h5 className="font-medium text-gray-900 mb-4">Impact Over Time</h5>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Impact visualization chart would be displayed here</p>
            <p className="text-sm">Showing beneficiary growth and milestone achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationTab = ({ project }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Third-Party Verification</h4>
    
    {/* Verification Status */}
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h5 className="font-medium text-green-900">Verified by Independent Auditor</h5>
          <p className="text-sm text-green-700">Last verified on January 15, 2024</p>
        </div>
      </div>
    </div>

    {/* Verification Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h5 className="font-medium text-gray-900">Verification Partner</h5>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">CA</span>
            </div>
            <div>
              <h6 className="font-medium text-gray-900">Chartered Accountants & Associates</h6>
              <p className="text-sm text-gray-600">Independent Audit Firm</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration:</span>
              <span className="font-medium">CA-REG-2019-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">15+ years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NGOs Audited:</span>
              <span className="font-medium">200+</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium text-gray-900">Verification Report</h5>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Financial Accuracy</span>
              <span className="text-sm font-medium text-green-600">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Impact Claims</span>
              <span className="text-sm font-medium text-green-600">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Documentation</span>
              <span className="text-sm font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Compliance</span>
              <span className="text-sm font-medium text-green-600">✓ Compliant</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Audit Schedule */}
    <div>
      <h5 className="font-medium text-gray-900 mb-4">Audit Schedule</h5>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Last Audit:</span>
            <p className="font-medium text-gray-900">January 15, 2024</p>
          </div>
          <div>
            <span className="text-gray-600">Next Audit:</span>
            <p className="font-medium text-gray-900">July 15, 2024</p>
          </div>
          <div>
            <span className="text-gray-600">Frequency:</span>
            <p className="font-medium text-gray-900">Bi-annual</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TransparencyTracker;