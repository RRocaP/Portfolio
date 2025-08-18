import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  title?: string;
}

export const ResearchFlask: React.FC<IconProps> = ({ 
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
    <path d="M9 2v6l-4 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-8V2"/>
    <line x1="7" y1="2" x2="17" y2="2"/>
    <circle cx="12" cy="14" r="1" fill="currentColor"/>
    <circle cx="9.5" cy="11.5" r="0.5" fill="currentColor"/>
    <circle cx="14.5" cy="12.5" r="0.5" fill="currentColor"/>
  </svg>
);