/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1C1F',
    background: '#ffffff',
    backgroundElement: '#F5F6FA',
    backgroundSelected: '#EBF4FF',
    textSecondary: '#60646C',
    primary: '#0052FF',
    primaryLight: '#F0F4FF',
    success: '#00CC66',
    successLight: '#E6F9F0',
    borderLight: '#EBF0F6',
    grayDark: '#1A1C1F',
    grayMedium: '#5C6066',
    grayLight: '#F5F6FA',
  },
  dark: {
    text: '#ffffff',
    background: '#121214',
    backgroundElement: '#1C1E22',
    backgroundSelected: '#2F3237',
    textSecondary: '#B0B4BA',
    primary: '#3385FF',
    primaryLight: '#1C2638',
    success: '#00E080',
    successLight: '#183328',
    borderLight: '#2E3135',
    grayDark: '#ffffff',
    grayMedium: '#B0B4BA',
    grayLight: '#1C1E22',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
