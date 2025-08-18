import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const AAVCapsid: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  title 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={!title}
  >
    {title && <title>{title}</title>}
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.54 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
    <path d="M12 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z"/>
  </svg>
);