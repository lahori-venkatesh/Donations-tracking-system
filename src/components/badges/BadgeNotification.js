import React, { useState, useEffect } from 'react';
import BadgeDisplay from './BadgeDisplay';

const BadgeNotification = ({ badge, onClose, onShare }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 8000); // Auto close after 8 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4
      transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-white rounded-2xl p-8 max-w-md w-full text-center
        transform transition-all duration-300
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        {/* Celebration Animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full animate-pulse"></div>
          </div>
          <div className="relative">
            <BadgeDisplay badge={badge} size="xl" showTooltip={false} />
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full
                  animate-bounce
                `}
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${10 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Congratulations! 🎉
        </h2>
        
        <h3 className="text-xl font-semibold text-primary-600 mb-3">
          You earned the {badge.name} badge!
        </h3>
        
        <p className="text-gray-600 mb-6">
          {badge.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onShare}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share Achievement</span>
          </button>
          
          <button
            onClick={handleClose}
            className="btn-secondary flex-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;