import React, { useState } from 'react';
import BadgeDisplay from '../badges/BadgeDisplay';
import badgeService from '../../services/badgeService';

const SocialShareModal = ({ 
  isOpen, 
  onClose, 
  badge, 
  donorStats, 
  donorName = 'Anonymous Donor' 
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [customMessage, setCustomMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-500',
      maxLength: 280
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      maxLength: 1300
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      maxLength: 500
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      maxLength: 150
    }
  ];

  const generateShareText = () => {
    return badgeService.generateSocialText(
      { name: donorName },
      badge,
      donorStats
    );
  };

  const handleGenerateText = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCustomMessage(generateShareText());
      setIsGenerating(false);
    }, 500);
  };

  const handleShare = () => {
    const text = customMessage || generateShareText();
    const url = 'https://donatetrack.com';
    
    let shareUrl = '';
    
    switch (selectedPlatform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Text copied to clipboard! You can now paste it in your Instagram post.');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    onClose();
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Share Your Achievement</h2>
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

        <div className="p-6">
          {/* Achievement Preview */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <BadgeDisplay badge={badge} size="xl" showTooltip={false} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {badge.name} Achievement Unlocked!
              </h3>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {donorStats.donationCount}
                  </div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">
                    ₹{donorStats.totalAmount?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">
                    {donorStats.projectCount || 3}
                  </div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Choose Platform</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${selectedPlatform === platform.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="text-sm font-medium">{platform.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Customization */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Customize Message</h4>
              <button
                onClick={handleGenerateText}
                disabled={isGenerating}
                className="btn-secondary text-sm"
              >
                {isGenerating ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  'Generate Text'
                )}
              </button>
            </div>
            
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={generateShareText()}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              maxLength={selectedPlatformData?.maxLength}
            />
            
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-500">
                {selectedPlatformData?.name} • Max {selectedPlatformData?.maxLength} characters
              </span>
              <span className={`
                ${(customMessage.length / selectedPlatformData?.maxLength) > 0.9 
                  ? 'text-red-500' 
                  : 'text-gray-500'
                }
              `}>
                {customMessage.length}/{selectedPlatformData?.maxLength}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className={`
                btn-primary flex-1 flex items-center justify-center space-x-2
                ${selectedPlatformData?.color}
              `}
            >
              <span>{selectedPlatformData?.icon}</span>
              <span>Share on {selectedPlatformData?.name}</span>
            </button>
            
            <button
              onClick={() => {
                const text = customMessage || generateShareText();
                navigator.clipboard.writeText(text);
                alert('Text copied to clipboard!');
              }}
              className="btn-secondary"
            >
              Copy Text
            </button>
          </div>

          {/* Additional Options */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">More Ways to Share</h5>
            <div className="flex space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share Link</span>
              </button>
              
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;