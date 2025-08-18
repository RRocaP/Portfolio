import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const GoogleScholar: React.FC<IconProps> = ({ 
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
    <path d="M5 11l7-7 7 7M4 18l8-8 8 8"/>
    <path d="M7 14c0 2.21 2.24 4 5 4s5-1.79 5-4"/>
    <circle cx="12" cy="14" r="1" fill="currentColor"/>
  </svg>
);