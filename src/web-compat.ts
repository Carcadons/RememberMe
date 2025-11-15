// Web compatibility layer for React Native -> React Web migration
// This file provides drop-in replacements for React Native components and APIs

import React, { CSSProperties } from 'react';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

// Re-export the constants for easy access
export { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS };

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

export const FlatList = ({ data, renderItem, keyExtractor, contentContainerStyle, refreshControl }: any) => {
  return (
    <div style={contentContainerStyle}>
      {data?.map((item: any, index: number) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem({ item, index, separators: {} })}
        </div>
      ))}
    </div>
  );
};

export const RefreshControl = (props: any) => {
  // Simplified - in a real app you'd implement pull-to-refresh
  return null;
};

// StyleSheet polyfill
export const StyleSheet = {
  create: (styles: any) => styles,
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
