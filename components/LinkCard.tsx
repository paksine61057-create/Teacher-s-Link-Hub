import React from 'react';
import { ExternalLink } from 'lucide-react';
import { LinkItem } from '../types';
import { PASTEL_PALETTE } from '../constants';

interface LinkCardProps {
  item: LinkItem;
  index: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ item, index }) => {
  // Use index to select color ensuring variety in the grid
  const themeIndex = index % PASTEL_PALETTE.length;
  const theme = PASTEL_PALETTE[themeIndex];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex flex-col justify-between p-5 rounded-2xl shadow-sm border 
        ${theme.bg} ${theme.border} ${theme.hoverBorder}
        hover:shadow-lg hover:-translate-y-1 hover:shadow-${theme.name.toLowerCase()}-100
        transition-all duration-300 relative overflow-hidden
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full -mr-10 -mt-10 blur-xl group-hover:opacity-40 transition-opacity"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`
          flex items-center justify-center w-14 h-14 rounded-2xl text-3xl 
          ${theme.iconBg} shadow-inner group-hover:scale-110 transition-transform duration-300
        `}>
          {item.icon}
        </div>
        <div className={`
          p-2 rounded-full bg-white/60 text-slate-400 
          group-hover:bg-white group-hover:${theme.text} transition-colors
        `}>
            <ExternalLink size={18} />
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className={`text-lg font-bold text-slate-800 mb-2 group-hover:${theme.text} line-clamp-1 transition-colors`}>
          {item.name}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-200/50 flex justify-between items-center relative z-10">
        <span className={`
          inline-block px-3 py-1 text-xs font-semibold rounded-lg bg-white/60 text-slate-500
        `}>
          {item.category}
        </span>
        <span className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${theme.text}`}>
          เปิดใช้งาน →
        </span>
      </div>
    </a>
  );
};

export default LinkCard;