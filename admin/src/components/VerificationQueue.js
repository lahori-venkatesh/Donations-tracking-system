import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VerificationQueue = ({ onUpdate }) => {
  const { API_BASE_URL } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockVerifications = [
        {
          id: '1',
          type: 'ngo_registration',
          ngo: {
            name: 'Hope Foundation',
            email: 'contact@hopefoundation.org',
            organization: 'Hope Foundation'
          },
          status: 'pending',
          submittedAt: '2024-01-25T10:30:00Z',
          priority: 'high',
          riskScore: 15
        },
        {
          id: '2',
          type: 'project_verification',
          ngo: {
            name: 'Learning Bridge',
            organization: 'Learning Bridge NGO'
          },
          project: {
            name: 'Education for All',
            description: 'Building schools for underprivileged children'
          },
          status: 'pending',
          submittedAt: '2024-01-26T14:15:00Z',
          priority: 'medium',
          riskScore: 25
        }
      ];

      setTimeout(() => {
        setVerifications(mockVerifications);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading verifications:', error);
      setLoading(false);
    }
  };

  const handleVerificationAction = async (verification, action) => {
    try {
      console.log(`${action} verification:`, verification.id);
      
      setVerifications(verifications.map(v => 
        v.id === verification.id 
          ? { ...v, status: action === 'approve' ? 'approved' : 'rejected' }
          : v
      ));

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error handling verification:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Queue</h2>
          <p className="text-gray-600 mt-1">Review and approve pending verifications</p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          {verifications.filter(v => v.status === 'pending').length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {verifications.map((verification) => (
          <div key={verification.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">
                  {verification.type === 'ngo_registration' ? '🏢' : '📋'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {verification.type === 'ngo_registration' ? 'NGO Registration' : 'Project Verification'}
                    </h3>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {verification.status}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {verification.priority}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p><strong>NGO:</strong> {verification.ngo.name} ({verification.ngo.organization})</p>
                    <p><strong>Email:</strong> {verification.ngo.email}</p>
                    {verification.project && (
                      <p><strong>Project:</strong> {verification.project.name}</p>
                    )}
                    <p><strong>Submitted:</strong> {new Date(verification.submittedAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Risk Score:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      verification.riskScore >= 70 ? 'bg-red-100 text-red-800' :
                      verification.riskScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {verification.riskScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleVerificationAction(verification, 'approve')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVerificationAction(verification, 'reject')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationQueue;