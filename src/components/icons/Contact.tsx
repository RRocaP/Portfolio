import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const Contact: React.FC<IconProps> = ({ 
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);