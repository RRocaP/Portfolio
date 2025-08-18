import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const AlphaHelix: React.FC<IconProps> = ({ 
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
    <path d="M8 2c2 0 4 2 4 4s-2 4-4 4 4 0 4 2 0 4 2 4 2-2 2-4-2-4-2-2-4 0-4-2 2-4 4-4z"/>
    <path d="M16 2c-2 0-4 2-4 4s2 4 4 4-4 0-4 2 0 4-2 4-2-2-2-4 2-4 2-2 4 0 4-2-2-4-4-4z"/>
  </svg>
);