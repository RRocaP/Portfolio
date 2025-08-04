import React from 'react';

export interface ContainerProps {
  /**
   * Container content
   */
  children: React.ReactNode;
  /**
   * Container max width
   */
  maxWidth?: 'full' | 'container' | 'prose' | 'prose-narrow';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface GridProps {
  /**
   * Grid content
   */
  children: React.ReactNode;
  /**
   * Grid columns
   */
  cols?: 'auto' | '12' | '1' | '2' | '3' | '4' | '6';
  /**
   * Grid gap
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Container component for content width management
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'container',
  className = '',
  ...props
}) => {
  const maxWidthClasses = {
    full: 'max-w-full',
    container: 'max-w-container',
    prose: 'max-w-prose',
    'prose-narrow': 'max-w-prose-narrow'
  };
  
  const classes = [
    'mx-auto px-4 sm:px-6 lg:px-8',
    maxWidthClasses[maxWidth],
    className
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Grid component for layout structure
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = 'auto',
  gap = 'md',
  className = '',
  ...props
}) => {
  const colClasses = {
    auto: 'auto-grid',
    '12': 'grid-12',
    '1': 'grid grid-cols-1',
    '2': 'grid grid-cols-1 sm:grid-cols-2',
    '3': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    '6': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };
  
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
    xl: 'gap-8 lg:gap-12'
  };
  
  const classes = [
    colClasses[cols],
    gapClasses[gap],
    className
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};