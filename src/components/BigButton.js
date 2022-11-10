import React, { useCallback } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'

import { useTheme } from '../theme/theme'

const createStyles = theme =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.foreground,
      shadowColor: 'black',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.background,
      lineHeight: 25,
    },
  })

const BigButton = ({ onPress, title }) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const activeOpacity = 0.5
  const _style = useCallback(
    ({ pressed }) => [{ opacity: pressed ? activeOpacity : 1 }, styles.button],
    [activeOpacity, styles],
  )

  return (
    <Pressable style={_style} onPress={onPress} activeOpacity={0.5}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

export default BigButton
