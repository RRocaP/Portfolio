import React from 'react';

export interface TypographyProps {
  /**
   * Text content
   */
  children: React.ReactNode;
  /**
   * Typography variant
   */
  variant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 
           'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm' |
           'body-xl' | 'body-lg' | 'body-md' | 'body-sm';
  /**
   * HTML element to render
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /**
   * Text color variant
   */
  color?: 'primary' | 'muted' | 'accent' | 'on-accent';
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Typography component implementing the design system type scale
 */
export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body-md',
  as: Component = 'p',
  color = 'primary',
  align = 'left',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    'display-xl': 'text-display-xl',
    'display-lg': 'text-display-lg',
    'display-md': 'text-display-md',
    'display-sm': 'text-display-sm',
    'heading-xl': 'text-heading-xl',
    'heading-lg': 'text-heading-lg',
    'heading-md': 'text-heading-md',
    'heading-sm': 'text-heading-sm',
    'body-xl': 'text-body-xl',
    'body-lg': 'text-body-lg',
    'body-md': 'text-body-md',
    'body-sm': 'text-body-sm',
  };
  
  const colorClasses = {
    primary: 'text-body-text',
    muted: 'text-text-muted',
    accent: 'text-accent-yellow',
    'on-accent': 'text-on-accent-text'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };
  
  const classes = [
    'font-sans',
    sizeClasses[variant],
    colorClasses[color],
    alignClasses[align],
    className
  ].join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};