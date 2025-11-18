import React from 'react';
import { Badge } from '../types';
import * as Icons from './icons/Icons';

interface BadgeIconProps {
  badge: Badge;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ badge }) => {
  const IconComponent = (Icons as any)[badge.icon] || Icons.ShieldCheckIcon;

  return (
    <div className="relative group flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <p className="font-bold text-sm">{badge.name}</p>
        <p>{badge.description}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default BadgeIcon;