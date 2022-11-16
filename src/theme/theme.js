import React from 'react'
import { Platform } from 'react-native'

const palette = {
  white: '#FFF',
  black: '#000',
  gray: '#8e8e93',
  gray2Light: '#aeaeb2',
  gray2Dark: '#636366',
  gray3Light: '#c7c7cc',
  gray3Dark: '#48484a',
  almostBlack: '#1c1c1e',
  almostWhite: '#f2f2f7',
}

const fonts = {
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
  sansSerif: {
    family: 'System',
  },
  serif: {
    ...Platform.select({
      ios: {
        family: 'NewYork-Regular',
      },
      android: {
        family: 'RobotoSerif',
      },
    }),
  },
}

export const lightTheme = {
  colors: {
    background: palette.almostWhite,
    foreground: palette.almostBlack,
    backgroundHighlighted: palette.white,
    readerBackground: palette.white,
    readerForeground: palette.almostBlack,
    gray: palette.gray,
    gray2: palette.gray2Light,
    gray3: palette.gray3Light,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  cornerRadius: 8,
  dropShadow: {
    color: palette.almostBlack,
    offset: {
      width: 2,
      height: 2,
    },
    opacity: 0.2,
    radius: 3,
  },
  text: {
    title1: {
      family: fonts.sansSerif.family,
      size: 28,
      weight: '600',
    },
    title2: {
      family: fonts.sansSerif.family,
      size: 22,
      weight: '500',
    },
    title3: {
      family: fonts.sansSerif.family,
      size: 20,
      weight: '400',
    },
    headline: {
      family: fonts.sansSerif.family,
      size: 17,
      weight: '600',
    },
    body: {
      family: fonts.sansSerif.family,
      size: 17,
      weight: '400',
    },
    footnote: {
      family: fonts.sansSerif.family,
      size: 13,
      weight: '400',
    },
    reader: {
      family: fonts.serif.family,
      size: 19,
      weight: '400',
    },
    footnoteMono: {
      family: fonts.monospaced.family,
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
    backgroundHighlighted: palette.black,
    readerBackground: palette.almostBlack,
    readerForeground: palette.almostWhite,
    gray2: palette.gray2Dark,
    gray3: palette.gray3Dark,
  },
  dropShadow: {
    ...lightTheme.dropShadow,
    color: palette.black,
    opacity: 0.6,
  },
}

export const ThemeContext = React.createContext(lightTheme)
export const useTheme = () => React.useContext(ThemeContext)
