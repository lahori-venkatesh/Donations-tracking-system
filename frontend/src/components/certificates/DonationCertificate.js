import React, { useState } from 'react';
import NGOVerificationBadge from '../verification/NGOVerificationBadge';

const DonationCertificate = ({ donation, ngo, donor, onClose, onDownload }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificateNumber = () => {
    const date = new Date(donation.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${ngo.registrationNumber}/DON/${year}${month}${day}/${donation.id.toString().padStart(4, '0')}`;
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call a backend service to generate PDF
      const certificateData = {
        certificateNumber: generateCertificateNumber(),
        donation,
        ngo,
        donor,
        generatedDate: new Date().toISOString()
      };
      
      // For demo, we'll create a downloadable HTML version
      generateHTMLCertificate(certificateData);
      
      if (onDownload) onDownload(certificateData);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTMLCertificate = (data) => {
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Donation Certificate - ${data.certificateNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .certificate { background: white; padding: 40px; border: 3px solid #2563eb; border-radius: 10px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
          .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #2563eb, #10b981); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; }
          .title { font-size: 28px; font-weight: bold; color: #1f2937; margin: 10px 0; }
          .subtitle { font-size: 16px; color: #6b7280; }
          .content { margin: 30px 0; }
          .section { margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #2563eb; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; }
          .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; border-bottom: 1px dotted #d1d5db; }
          .detail-label { font-weight: 600; color: #374151; }
          .detail-value { color: #1f2937; }
          .amount-highlight { background: linear-gradient(135deg, #2563eb, #10b981); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .amount-text { font-size: 24px; font-weight: bold; }
          .tax-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
          .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
          .signature-box { text-align: center; width: 200px; }
          .signature-line { border-top: 1px solid #374151; margin-top: 50px; padding-top: 5px; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(37, 99, 235, 0.1); font-weight: bold; z-index: 0; }
          .certificate-content { position: relative; z-index: 1; }
          @media print { body { background: white; margin: 0; } .certificate { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="watermark">DONATION CERTIFICATE</div>
        <div class="certificate">
          <div class="certificate-content">
            <div class="header">
              <div class="logo">DT</div>
              <div class="title">DONATION CERTIFICATE</div>
              <div class="subtitle">For Income Tax Purposes under Section 80G</div>
              <div style="margin-top: 15px; font-weight: bold; color: #2563eb;">Certificate No: ${data.certificateNumber}</div>
            </div>

            <div class="content">
              <div class="section">
                <div class="section-title">NGO Details</div>
                <div class="detail-row">
                  <span class="detail-label">Organization Name:</span>
                  <span class="detail-value">${data.ngo.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Registration Number:</span>
                  <span class="detail-value">${data.ngo.registrationNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">PAN Number:</span>
                  <span class="detail-value">${data.ngo.panNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${data.ngo.address}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${data.ngo.email}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Donor Details</div>
                <div class="detail-row">
                  <span class="detail-label">Full Name:</span>
                  <span class="detail-value">${data.donor.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">PAN Number:</span>
                  <span class="detail-value">${data.donor.panNumber || 'Not Provided'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${data.donor.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">${data.donor.phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Donation Details</div>
                <div class="detail-row">
                  <span class="detail-label">Date of Donation:</span>
                  <span class="detail-value">${new Date(data.donation.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Project:</span>
                  <span class="detail-value">${data.donation.project}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Mode of Payment:</span>
                  <span class="detail-value">${data.donation.paymentMode || 'Online Payment'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID:</span>
                  <span class="detail-value">${data.donation.transactionId || 'TXN' + Date.now()}</span>
                </div>
                
                <div class="amount-highlight">
                  <div class="amount-text">₹${data.donation.amount.toLocaleString('en-IN')}</div>
                  <div>Amount Donated (Rupees ${numberToWords(data.donation.amount)} Only)</div>
                </div>
              </div>

              <div class="tax-notice">
                <strong>Tax Benefit Notice:</strong> This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961. 
                The donor can claim 50% of the donated amount as deduction from taxable income, subject to applicable limits and conditions.
                Please consult your tax advisor for specific guidance.
              </div>

              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-line">
                    <strong>Authorized Signatory</strong><br>
                    ${data.ngo.name}
                  </div>
                </div>
                <div class="signature-box">
                  <div class="signature-line">
                    <strong>Date of Issue</strong><br>
                    ${new Date(data.generatedDate).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p style="font-size: 12px; color: #6b7280; margin: 0;">
                This is a computer-generated certificate and does not require a physical signature.<br>
                For verification, please contact ${data.ngo.email} or visit ${data.ngo.website}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the HTML file
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Donation_Certificate_${data.certificateNumber.replace(/\//g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const numberToWords = (num) => {
    // Simple number to words conversion for Indian format
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Donation Certificate</h2>
              <p className="text-gray-600">Tax deduction certificate under Section 80G</p>
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

        {/* Certificate Preview */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {/* NGO Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {ngo.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2)}
                  </span>
                </div>
                {/* Platform Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">DT</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">DONATION CERTIFICATE</h3>
              <p className="text-gray-600">For Income Tax Purposes under Section 80G</p>
              <p className="text-sm font-semibold text-primary-600 mt-2">
                Certificate No: {generateCertificateNumber()}
              </p>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <NGOVerificationBadge ngo={ngo} size="sm" />
                <span className="text-xs text-gray-500">Verified NGO</span>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* NGO Details */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-center border-b pb-2">NGO Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{ngo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration:</span>
                    <span className="font-medium">{ngo.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PAN:</span>
                    <span className="font-medium">{ngo.panNumber}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Address:</strong> {ngo.address}
                  </div>
                </div>
              </div>

              {/* Donor Details */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-center border-b pb-2">Donor Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{donor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PAN:</span>
                    <span className="font-medium">{donor.panNumber || 'Not Provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-xs">{donor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{donor.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
              <h4 className="font-bold text-gray-900 mb-3 text-center border-b pb-2">Donation Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(donation.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project:</span>
                  <span className="font-medium">{donation.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode:</span>
                  <span className="font-medium">{donation.paymentMode || 'Online'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">TXN{Date.now()}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">₹{donation.amount.toLocaleString('en-IN')}</div>
                <div className="text-sm opacity-90">
                  Rupees {numberToWords(donation.amount)} Only
                </div>
              </div>
            </div>

            {/* Tax Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800 mb-1">Tax Benefit Notice:</p>
                  <p className="text-yellow-700">
                    This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961. 
                    You can claim 50% of the donated amount as deduction from taxable income, subject to applicable limits.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end text-center text-sm">
              <div>
                <div className="border-t border-gray-400 w-32 mb-1"></div>
                <p className="font-semibold">Authorized Signatory</p>
                <p className="text-gray-600">{ngo.name}</p>
              </div>
              <div>
                <div className="border-t border-gray-400 w-32 mb-1"></div>
                <p className="font-semibold">Date of Issue</p>
                <p className="text-gray-600">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Certificate...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Certificate</span>
                </div>
              )}
            </button>
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-3"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCertificate;