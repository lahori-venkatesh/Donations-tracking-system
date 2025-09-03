import React, { useState } from 'react';

const NGOVerificationBadge = ({ ngo, showDetails = false, size = 'md' }) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const getVerificationLevel = () => {
    if (!ngo.verification) return 'unverified';
    return ngo.verification.level || 'basic';
  };

  const getVerificationConfig = (level) => {
    const configs = {
      unverified: {
        label: 'Unverified',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
        description: 'This NGO has not completed verification'
      },
      basic: {
        label: 'Basic Verified',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        description: 'Basic documents verified'
      },
      verified: {
        label: 'Verified NGO',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        description: 'Fully verified with all required documents'
      },
      premium: {
        label: 'Premium Verified',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
        description: 'Premium verification with audit reports and high transparency score'
      },
      suspended: {
        label: 'Suspended',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728',
        description: 'Verification suspended due to compliance issues'
      }
    };
    return configs[level] || configs.unverified;
  };

  const getSizeClasses = (size) => {
    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-2'
    };
    return sizes[size] || sizes.md;
  };

  const level = getVerificationLevel();
  const config = getVerificationConfig(level);

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowVerificationModal(true)}
          className={`
            inline-flex items-center space-x-1 rounded-full border font-medium transition-colors
            ${config.color} ${getSizeClasses(size)}
            hover:opacity-80 cursor-pointer
          `}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
          </svg>
          <span>{config.label}</span>
        </button>

        {showDetails && ngo.verification?.badges && (
          <div className="flex items-center space-x-1">
            {ngo.verification.badges.slice(0, 3).map((badge, index) => (
              <div
                key={index}
                className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${getBadgeColor(badge.color)}
                `}
                title={badge.label}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getBadgeIcon(badge.icon)} />
                </svg>
                {badge.label}
              </div>
            ))}
            {ngo.verification.badges.length > 3 && (
              <span className="text-xs text-gray-500">
                +{ngo.verification.badges.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Verification Details Modal */}
      {showVerificationModal && (
        <VerificationDetailsModal
          ngo={ngo}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </>
  );
};

const VerificationDetailsModal = ({ ngo, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709' },
    { id: 'documents', label: 'Documents', icon: 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709' },
    { id: 'compliance', label: 'Compliance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'audit', label: 'Audit Trail', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">NGO Verification Details</h2>
              <p className="text-gray-600">{ngo.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && <OverviewTab ngo={ngo} />}
          {activeTab === 'documents' && <DocumentsTab ngo={ngo} />}
          {activeTab === 'compliance' && <ComplianceTab ngo={ngo} />}
          {activeTab === 'audit' && <AuditTab ngo={ngo} />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ ngo }) => (
  <div className="space-y-6">
    {/* Verification Status */}
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Verification Status</h3>
        <NGOVerificationBadge ngo={ngo} size="lg" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {ngo.verification?.complianceScore || 0}%
          </div>
          <div className="text-sm text-gray-600">Compliance Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {ngo.verification?.documents ? Object.keys(ngo.verification.documents).length : 0}
          </div>
          <div className="text-sm text-gray-600">Documents Verified</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {ngo.verification?.badges?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Trust Badges</div>
        </div>
      </div>
    </div>

    {/* Trust Badges */}
    {ngo.verification?.badges && ngo.verification.badges.length > 0 && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ngo.verification.badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBadgeColor(badge.color)}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getBadgeIcon(badge.icon)} />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">{badge.label}</div>
                <div className="text-sm text-gray-600">Verified certification</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Key Information */}
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Key Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Registration Number:</span>
            <span className="font-medium">{ngo.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">PAN Number:</span>
            <span className="font-medium">{ngo.panNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Founded:</span>
            <span className="font-medium">{ngo.founded}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Verification Date:</span>
            <span className="font-medium">
              {ngo.verification?.verifiedDate ? 
                new Date(ngo.verification.verifiedDate).toLocaleDateString('en-IN') : 
                'Not verified'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Next Review:</span>
            <span className="font-medium">
              {ngo.verification?.nextReviewDate ? 
                new Date(ngo.verification.nextReviewDate).toLocaleDateString('en-IN') : 
                'N/A'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Projects Completed:</span>
            <span className="font-medium">{ngo.projectsCompleted || 0}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentsTab = ({ ngo }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Document Verification Status</h3>
    
    <div className="space-y-4">
      {[
        { key: 'ngo_registration_certificate', label: 'NGO Registration Certificate', required: true },
        { key: 'pan_card', label: 'PAN Card', required: true },
        { key: 'tan_certificate', label: 'TAN Certificate', required: false },
        { key: '12a_certificate', label: '12A Certificate', required: false },
        { key: '80g_certificate', label: '80G Certificate', required: false },
        { key: 'fcra_certificate', label: 'FCRA Certificate', required: false },
        { key: 'audit_reports', label: 'Annual Audit Reports', required: false }
      ].map((doc) => {
        const docData = ngo.verification?.documents?.[doc.key];
        const isVerified = docData?.verified;
        const isSubmitted = !!docData;
        
        return (
          <div key={doc.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isVerified ? 'bg-green-100 text-green-600' : 
                  isSubmitted ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-gray-100 text-gray-400'}
              `}>
                {isVerified ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isSubmitted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {doc.label}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div className="text-sm text-gray-600">
                  {isVerified ? 'Verified' : 
                   isSubmitted ? 'Under Review' : 
                   'Not Submitted'}
                </div>
              </div>
            </div>
            
            {docData?.verifiedDate && (
              <div className="text-sm text-gray-500">
                Verified: {new Date(docData.verifiedDate).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const ComplianceTab = ({ ngo }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Compliance & Risk Assessment</h3>
    
    {/* Compliance Score */}
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Overall Compliance Score</h4>
        <div className="text-3xl font-bold text-green-600">
          {ngo.verification?.complianceScore || 0}%
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${ngo.verification?.complianceScore || 0}%` }}
        ></div>
      </div>
    </div>

    {/* Risk Assessment */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Fraud Risk Score</span>
            <span className={`font-bold ${
              (ngo.verification?.fraudRiskScore || 0) < 30 ? 'text-green-600' :
              (ngo.verification?.fraudRiskScore || 0) < 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {ngo.verification?.fraudRiskScore || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                (ngo.verification?.fraudRiskScore || 0) < 30 ? 'bg-green-500' :
                (ngo.verification?.fraudRiskScore || 0) < 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${ngo.verification?.fraudRiskScore || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Transparency Score</span>
            <span className="font-bold text-blue-600">{ngo.transparencyScore || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${ngo.transparencyScore || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    {/* Compliance Checklist */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checklist</h4>
      <div className="space-y-3">
        {[
          { label: 'Annual Returns Filed', status: ngo.compliance?.annualReturnsFiled },
          { label: 'Audit Reports Submitted', status: ngo.compliance?.auditReportsSubmitted },
          { label: 'Project Updates Regular', status: ngo.compliance?.regularUpdates },
          { label: 'Financial Transparency', status: ngo.compliance?.financialTransparency },
          { label: 'Beneficiary Feedback', status: ngo.compliance?.beneficiaryFeedback }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">{item.label}</span>
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}>
              {item.status ? 'Compliant' : 'Non-Compliant'}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AuditTab = ({ ngo }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Audit Trail & Activity Log</h3>
    
    <div className="space-y-4">
      {(ngo.auditTrail || []).map((entry, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{entry.action}</h4>
              <span className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
            {entry.hash && (
              <div className="mt-2 text-xs text-gray-400 font-mono">
                Hash: {entry.hash}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {(!ngo.auditTrail || ngo.auditTrail.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No audit trail available</p>
        </div>
      )}
    </div>
  </div>
);

// Helper functions
const getBadgeColor = (color) => {
  const colors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    indigo: 'bg-indigo-100 text-indigo-700'
  };
  return colors[color] || 'bg-gray-100 text-gray-700';
};

const getBadgeIcon = (icon) => {
  const icons = {
    'shield-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'certificate': 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709',
    'award': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    'globe': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    'eye': 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
  };
  return icons[icon] || icons['shield-check'];
};

export default NGOVerificationBadge;