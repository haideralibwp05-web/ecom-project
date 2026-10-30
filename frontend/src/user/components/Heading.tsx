import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading = ({ level = 1, children, className = '', ...props }: HeadingProps) => {
  const Tag = `h${level}` as const;
  
  const sizeClasses = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold',
    3: 'text-2xl font-medium',
    4: 'text-xl font-medium',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  };

  return (
    <Tag className={`${sizeClasses[level]} ${className}`} {...props}>
      children
    </Tag>
  );
};
