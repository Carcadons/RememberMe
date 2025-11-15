import React, { CSSProperties } from 'react';

interface ViewProps {
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  onPress?: () => void;
  onClick?: () => void;
}

export const View: React.FC<ViewProps> = ({ children, style, className, onPress, onClick }) => {
  const handleClick = () => {
    onPress?.();
    onClick?.();
  };

  return (
    <div style={style} className={className} onClick={handleClick}>
      {children}
    </div>
  );
};
