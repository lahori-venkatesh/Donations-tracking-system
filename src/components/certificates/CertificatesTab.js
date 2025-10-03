import React, { useState } from 'react';
import DonationCertificate from './DonationCertificate';

const CertificatesTab = ({ donations, currentUser }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [certificates, setCertificates] = useState([]);

  // Mock NGO data - in real app, this would come from the donation/project data
  const getNGOData = (projectName) => {
    const ngoMap = {
      'Clean Water Initiative - Tamil Nadu': {
        name: 'Asha Foundation',
        registrationNumber: 'REG/2015/NGO/001',
        panNumber: 'AABCA1234E',
        address: '123 Anna Salai, Chennai, Tamil Nadu 600002',
        email: 'contact@ashafoundation.org',
        website: 'https://ashafoundation.org',
        phone: '+91-9876-543210'
      },
      'Education for All - Karnataka': {
        name: 'Vidya Foundation',
        registrationNumber: 'REG/2012/EDU/002',
        panNumber: 'AABCV5678F',
        address: '456 MG Road, Bangalore, Karnataka 560001',
        email: 'info@vidyafoundation.org',
        website: 'https://vidyafoundation.org',
        phone: '+91-98765-43210'
      },
      'Healthcare Support - Kerala': {
        name: 'Arogya Seva Trust',
        registrationNumber: 'REG/2010/MED/004',
        panNumber: 'AABCA9012G',
        address: '321 Medical College Road, Kochi, Kerala 682011',
        email: 'medical@arogyasevatrust.org',
        website: 'https://arogyasevatrust.org',
        phone: '+91-9876-345678'
      }
    };

    return ngoMap[projectName] || {
      name: 'Asha Foundation',
      registrationNumber: 'REG/2015/NGO/001',
      panNumber: 'AABCA1234E',
      address: '123 Anna Salai, Chennai, Tamil Nadu 600002',
      email: 'contact@ashafoundation.org',
      website: 'https://ashafoundation.org',
      phone: '+91-9876-543210'
    };
  };

  const getDonorData = () => ({
    name: currentUser?.name || 'Arjun Krishnan',
    email: currentUser?.email || 'arjun.krishnan@example.com',
    phone: currentUser?.phone || '+91-9876-543210',
    panNumber: currentUser?.panNumber || 'ABCDE1234F' // In real app, this would be collected during registration
  });

  const handleGenerateCertificate = (donation) => {
    setSelectedDonation(donation);
    setShowCertificate(true);
  };

  const handleCertificateDownload = (certificateData) => {
    // Add to certificates list
    setCertificates(prev => [...prev, {
      id: Date.now(),
      ...certificateData,
      downloadedAt: new Date().toISOString()
    }]);
    
    // Show success message
    alert('Certificate downloaded successfully! You can access it anytime from your certificates list.');
  };

  const eligibleDonations = donations.filter(donation => 
    donation.status === 'Completed' || donation.status === 'Active'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tax Certificates</h2>
            <p className="text-gray-600">Download donation certificates for tax deduction under Section 80G</p>
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Tax Information</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Donations are eligible for 50% tax deduction under Section 80G of Income Tax Act, 1961</li>
              <li>• Maximum deduction limit is 10% of adjusted gross total income</li>
              <li>• Keep these certificates safe for filing your income tax returns</li>
              <li>• Consult your tax advisor for specific guidance on claiming deductions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Eligible Donations */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Certificates</h3>
        
        {eligibleDonations.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Eligible Donations</h3>
            <p className="text-gray-600">Make a donation to generate tax certificates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eligibleDonations.map((donation) => (
              <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{donation.project}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Amount: ₹{donation.amount.toLocaleString('en-IN')}</span>
                      <span>Date: {new Date(donation.date).toLocaleDateString('en-IN')}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{donation.impact}</p>
                  </div>
                  <button
                    onClick={() => handleGenerateCertificate(donation)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
                      </svg>
                      <span>Generate Certificate</span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downloaded Certificates */}
      {certificates.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Downloaded Certificates</h3>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{cert.donation.project}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Certificate No: {cert.certificateNumber}</span>
                    <span>Downloaded: {new Date(cert.downloadedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary-600">₹{cert.donation.amount.toLocaleString('en-IN')}</span>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && selectedDonation && (
        <DonationCertificate
          donation={selectedDonation}
          ngo={getNGOData(selectedDonation.project)}
          donor={getDonorData()}
          onClose={() => {
            setShowCertificate(false);
            setSelectedDonation(null);
          }}
          onDownload={handleCertificateDownload}
        />
      )}
    </div>
  );
};

export default CertificatesTab;