import React from 'react';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'lead' | 'muted';
  children: React.ReactNode;
}

export const Paragraph = ({ variant = 'default', children, className = '', ...props }: ParagraphProps) => {
  const variantClasses = {
    default: 'text-base text-gray-800 leading-relaxed',
    lead: 'text-xl text-gray-900 font-normal leading-normal',
    muted: 'text-sm text-gray-500',
  };

  return (
    <p className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
};
