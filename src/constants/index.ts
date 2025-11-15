import { Platform } from 'react-native';

export const COLORS = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6', // Purple
  success: '#10b981', // Emerald
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    dark: '#111827',
    darkSecondary: '#1f2937',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    light: '#9ca3af',
    dark: '#ffffff',
  },
  border: {
    light: '#e5e7eb',
    dark: '#374151',
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

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
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

export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

export const QUICK_FACT_LIMIT = 30;
export const MAX_QUICK_FACTS = 3;
export const MAX_TAGS = 5;

export const CONSENT_TEMPLATE = `Hi {{NAME}},

I use RememberMe to keep brief memory notes so I can show up prepared for our meetings and remember important details about the people I work with.

It stores only minimal info: your name, role, and 2-3 quick facts (like your kids' names, favorite coffee, or how we met). All data is encrypted on my device and never shared without explicit consent.

Would you be comfortable with me storing a short note about you? I'm happy to share exactly what I store or delete it anytime.

Thanks!`;

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
