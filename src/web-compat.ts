// Web compatibility layer for React Native -> React Web migration
// This file provides drop-in replacements for React Native components and APIs

import React, { CSSProperties } from 'react';

// Re-export Web Components as React Native primitives
export const View = ({ children, style, className, onPress, onClick, ...props }: any) => {
  const handleClick = () => {
    onPress?.();
    onClick?.();
  };
  return (
    <div style={style} className={className} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};

export const Text = ({ children, style, className, numberOfLines, ...props }: any) => {
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
    <span style={textStyle} className={className} {...props}>
      {children}
    </span>
  );
};

export const ScrollView = ({ children, style, contentContainerStyle, ...props }: any) => {
  const combinedStyle = { ...style, ...contentContainerStyle };
  return (
    <div style={{ overflow: 'auto', ...combinedStyle }} {...props}>
      {children}
    </div>
  );
};

export const TouchableOpacity = ({ children, onPress, style, activeOpacity = 0.7, ...props }: any) => {
  const [pressed, setPressed] = React.useState(false);

  const handleClick = () => {
    onPress?.();
  };

  return (
    <div
      style={{
        ...style,
        cursor: 'pointer',
        opacity: pressed ? activeOpacity : 1,
      }}
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export const TextInput = ({ style, value, onChangeText, placeholder, secureTextEntry, ...props }: any) => {
  return (
    <input
      type={secureTextEntry ? 'password' : 'text'}
      style={{
        ...style,
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
      }}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  );
};

export const SafeAreaView = ({ children, style }: any) => {
  return <div style={{ paddingTop: 'env(safe-area-inset-top)', ...style }}>{children}</div>;
};

export const KeyboardAvoidingView = ({ children, style, behavior = 'padding' }: any) => {
  // Simplified - in real app you'd use proper keyboard handling
  return <div style={style}>{children}</div>;
};

export const Switch = ({ value, onValueChange, trackColor }: any) => {
  return (
    <button
      onClick={() => onValueChange?.(!value)}
      style={{
        width: 51,
        height: 31,
        backgroundColor: value ? trackColor?.true : trackColor?.false,
        borderRadius: 16,
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 27,
          height: 27,
          backgroundColor: 'white',
          borderRadius: 13,
          position: 'absolute',
          top: 2,
          left: value ? 25 : 2,
          transition: 'all 0.2s',
        }}
      />
    </button>
  );
};

export const ActivityIndicator = ({ size = 'small', color = COLORS.primary }: any) => {
  const sizePx = size === 'large' ? 40 : 20;
  return (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

export const Image = ({ source, style }: any) => {
  const uri = typeof source === 'object' ? source.uri : source;
  return <img src={uri} style={style} />;
};

// Alert polyfill
export const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    if (typeof window !== 'undefined') {
      const result = window.confirm(`${title}\n\n${message || ''}`);
      if (result && buttons?.[0]?.onPress) {
        buttons[0].onPress();
      } else if (!result && buttons?.[1]?.onPress) {
        buttons[1].onPress();
      }
    }
  },
};

// Platform polyfill
export const Platform = {
  OS: 'web',
  select: (obj: any) => obj.web || obj.default,
};

// Constants
export const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    light: '#9ca3af',
    dark: '#ffffff',
  },
  border: {
    light: '#e5e7eb',
  },
  chip: {
    blue: '#dbeafe',
    green: '#d1fae5',
    yellow: '#fef3c7',
    purple: '#e0e7ff',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  title: 24,
  subtitle: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
