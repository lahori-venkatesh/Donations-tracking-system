import React from 'react';
import { BADGE_TYPES, AMOUNT_BADGES } from '../../services/badgeService';

const BadgeDisplay = ({ badge, size = 'md', showTooltip = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const allBadges = { ...BADGE_TYPES, ...AMOUNT_BADGES };
  const badgeData = allBadges[badge.id] || badge;

  return (
    <div className={`relative group ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        ${badgeData.color} 
        rounded-full 
        flex items-center justify-center 
        shadow-lg 
        border-2 border-white
        transform transition-all duration-200
        group-hover:scale-110 group-hover:shadow-xl
      `}>
        <span className={iconSizes[size]}>{badgeData.icon}</span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div className="font-semibold">{badgeData.name}</div>
          <div className="text-xs text-gray-300">{badgeData.description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;