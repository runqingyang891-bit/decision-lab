import React from 'react';

interface HandDrawnFrameProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const HandDrawnFrame = React.forwardRef<HTMLDivElement, HandDrawnFrameProps>(
  ({ children, className = '', onClick }, ref) => {
    return (
      <div 
        ref={ref}
        className={`hand-drawn-box bg-white p-6 ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

HandDrawnFrame.displayName = 'HandDrawnFrame';
