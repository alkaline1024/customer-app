import { TextStyle } from 'react-native';

export const baseTokens = {
  colors: {
    background: '#F8FAFC',
    backgroundMuted: '#E2E8F0',
    surface: '#FFFFFF',
    borderSubtle: '#E2E8F0',
    borderDefault: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#475569',
    textInverse: '#FFFFFF',
    danger: '#B91C1C',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 10,
    md: 12,
    pill: 999,
  },
  border: {
    hairline: 1,
  },
  typography: {
    screenTitle: {
      fontSize: 24,
      fontWeight: '700',
    } satisfies TextStyle,
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
    } satisfies TextStyle,
    body: {
      fontSize: 15,
    } satisfies TextStyle,
    bodySmall: {
      fontSize: 14,
    } satisfies TextStyle,
    label: {
      fontSize: 16,
      fontWeight: '600',
    } satisfies TextStyle,
    button: {
      fontSize: 15,
      fontWeight: '600',
    } satisfies TextStyle,
    badge: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.4,
    } satisfies TextStyle,
  },
};
