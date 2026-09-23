import React from 'react';

/**
 * Traditional Indian botanical & floral motif elements
 * Inspired by Kalamkari and Madhubani botanical borders.
 */

interface BotanicalCornerProps {
  className?: string;
  color?: string; // e.g., '#D49B24' or '#C2542D' or '#1E4D38'
  size?: number;
}

export const BotanicalCorner: React.FC<BotanicalCornerProps> = ({
  className = '',
  color = '#D49B24',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Corner botanical flourish */}
      <path
        d="M6 6C16 6 24 14 24 24C24 34 32 42 42 42"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M14 6C17 11 16 16 11 17C6 16 8 10 14 6Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M24 16C29 18 31 23 27 26C23 27 21 21 24 16Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M32 26C37 28 39 33 35 36C31 37 29 31 32 26Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.2"
      />
      {/* Tiny bud / berry */}
      <circle cx="6" cy="6" r="3" fill={color} />
      <circle cx="42" cy="42" r="2.5" fill={color} />
    </svg>
  );
};

export const BotanicalDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 select-none ${className}`} aria-hidden="true">
      <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#D49B24]/60 to-[#C2542D]" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D49B24]">
        {/* Central flower / leaf blossom */}
        <circle cx="12" cy="12" r="2.5" fill="#C2542D" />
        <path
          d="M12 4C13.5 7 13.5 9 12 10C10.5 9 10.5 7 12 4Z"
          fill="#D49B24"
        />
        <path
          d="M12 20C13.5 17 13.5 15 12 14C10.5 15 10.5 17 12 20Z"
          fill="#D49B24"
        />
        <path
          d="M4 12C7 10.5 9 10.5 10 12C9 13.5 7 13.5 4 12Z"
          fill="#1E4D38"
        />
        <path
          d="M20 12C17 10.5 15 10.5 14 12C15 13.5 17 13.5 20 12Z"
          fill="#1E4D38"
        />
      </svg>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#D49B24]/60 to-[#C2542D]" />
    </div>
  );
};
