import React from 'react';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'academic-profile' | 'contact';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler for interactive cards
   */
  onClick?: () => void;
  /**
   * Whether card is clickable
   */
  clickable?: boolean;
}

/**
 * Card component for grouping content
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  clickable = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg border transition-colors';
  
  const variantClasses = {
    default: 'bg-surface-1 border-border p-6',
    'academic-profile': 'academic-profile-card',
    contact: 'bg-primary-bg border-border p-6 hover:border-accent-yellow/30 focus-ring'
  };
  
  const interactiveClasses = clickable || onClick ? 'cursor-pointer hover:border-accent-yellow/40' : '';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    interactiveClasses,
    className
  ].join(' ');

  const CardElement = onClick ? 'button' : 'div';

  return (
    <CardElement
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </CardElement>
  );
};