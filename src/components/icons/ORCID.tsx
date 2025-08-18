import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const ORCID: React.FC<IconProps> = ({ 
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
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor"/>
    <path d="M8 11v6m4-6v6m0-6c0-1.5 1.5-3 3.5-3s3.5 1.5 3.5 3v6"/>
  </svg>
);