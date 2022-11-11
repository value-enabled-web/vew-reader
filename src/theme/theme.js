import React from 'react'
import { Platform } from 'react-native'

const palette = {
  white: '#FFF',
  black: '#000',
  gray: '#8e8e93',
  almostBlack: '#1c1c1e',
  almostWhite: '#f2f2f7',
}

export const lightTheme = {
  colors: {
    background: palette.almostWhite,
    foreground: palette.almostBlack,
    readerBackground: palette.white,
    readerForeground: palette.almostBlack,
    gray: palette.gray,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  fonts: {
    monospaced: {
      ...Platform.select({
        ios: {
          family: 'Menlo',
        },
        android: {
          family: 'monospace',
        },
      }),
    },
  },
  text: {
    title1: {
      family: 'System',
      size: 28,
      weight: '600',
    },
    title2: {
      family: 'System',
      size: 22,
      weight: '500',
    },
    title3: {
      family: 'System',
      size: 20,
      weight: '400',
    },
    headline: {
      family: 'System',
      size: 17,
      weight: '600',
    },
    body: {
      family: 'System',
      size: 17,
      weight: '400',
    },
    reader: {
      family: 'Times New Roman',
      size: 20,
      weight: '400',
    },
    footnote: {
      family: 'System',
      size: 13,
      weight: '400',
    },
  },
}

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.almostBlack,
    foreground: palette.almostWhite,
    readerBackground: palette.almostBlack,
    readerForeground: palette.almostWhite,
  },
}

export const ThemeContext = React.createContext(lightTheme)
export const useTheme = () => React.useContext(ThemeContext)
