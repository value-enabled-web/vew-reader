import React from 'react';

const palette = {
  white: '#FFF',
  foreground: '#0B0B0B',
  background: '#F0F2F3',
};

export const theme = {
  colors: {
    background: palette.background,
    foreground: palette.foreground,
    white: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  fonts: {
    monospaced: {
      family: 'Courier New',
      size: 12,
      weight: '500',
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.black,
    foreground: palette.white,
  },
};

export const ThemeContext = React.createContext(theme);
export const useTheme = () => React.useContext(ThemeContext);
