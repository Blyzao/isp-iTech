import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  shadow = 'soft-xl', 
  rounded = '2xl',
  gradient = false,
  gradientFrom = 'blue-600',
  gradientTo = 'cyan-400',
  ...props 
}) => {
  const shadowClasses = {
    'soft-xs': 'shadow-[0_3px_5px_-1px_rgba(0,0,0,0.09),0_2px_3px_-1px_rgba(0,0,0,0.07)]',
    'soft-sm': 'shadow-[0_0.25rem_0.375rem_-0.0625rem_hsla(0,0%,8%,0.12),0_0.125rem_0.25rem_-0.0625rem_hsla(0,0%,8%,0.07)]',
    'soft-md': 'shadow-[0_4px_7px_-1px_rgba(0,0,0,0.11),0_2px_4px_-1px_rgba(0,0,0,0.07)]',
    'soft-lg': 'shadow-[0_2px_12px_0_rgba(0,0,0,0.16)]',
    'soft-xl': 'shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]',
    'soft-2xl': 'shadow-[0_0.3125rem_0.625rem_0_rgba(0,0,0,0.12)]'
  };

  const roundedClasses = {
    'xs': 'rounded-sm',
    'sm': 'rounded',
    'md': 'rounded-md',
    'lg': 'rounded-lg', 
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  };

  const baseClasses = [
    'relative flex flex-col min-w-0 break-words bg-white bg-clip-border',
    shadowClasses[shadow] || shadowClasses['soft-xl'],
    roundedClasses[rounded] || roundedClasses['2xl'],
    'transition-all duration-200 ease-soft-in-out'
  ];

  if (gradient) {
    baseClasses.push(`bg-gradient-to-tl from-${gradientFrom} to-${gradientTo}`);
  }

  return (
    <div 
      className={`${baseClasses.join(' ')} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex-auto p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`flex-auto p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`flex-auto p-4 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;