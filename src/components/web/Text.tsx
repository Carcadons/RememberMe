import React, { CSSProperties } from 'react';

interface TextProps {
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({ children, style, className, numberOfLines }) => {
  const textStyle: CSSProperties = {
    ...style,
    ...(numberOfLines ? {
      display: '-webkit-box',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical' as any,
      overflow: 'hidden',
    } : {}),
  };

  return (
    <span style={textStyle} className={className}>
      {children}
    </span>
  );
};
