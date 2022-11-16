import React, { useEffect, useState, useRef } from 'react'
import {
  AppState,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native'

import Clipboard from '@react-native-clipboard/clipboard'

import { useThemed } from '../hooks/useThemed'

const styles = theme =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'stretch',
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.m,
    },
    articleContainer: {
      backgroundColor: theme.colors.backgroundHighlighted,
      padding: theme.spacing.m,
      borderRadius: theme.cornerRadius,
      shadowColor: theme.dropShadow.color,
      shadowOffset: theme.dropShadow.offset,
      shadowOpacity: theme.dropShadow.opacity,
      shadowRadius: theme.dropShadow.radius,
      marginBottom: theme.spacing.m,
    },
    articleTitle: {
      fontFamily: theme.text.headline.family,
      fontWeight: theme.text.headline.weight,
      fontSize: theme.text.headline.size,
      color: theme.colors.foreground,
      marginBottom: 2,
    },
    articleSubtitle: {
      fontFamily: theme.text.footnote.family,
      fontWeight: theme.text.footnote.weight,
      fontSize: theme.text.footnote.size,
      color: theme.colors.foreground,
    },
    clipbardArticleTitle: {
      color: theme.colors.gray2,
    },
    clipboardUrl: {
      fontFamily: theme.text.footnoteMono.family,
      fontWeight: theme.text.footnoteMono.weight,
      fontSize: theme.text.footnoteMono.size,
      color: theme.colors.gray3,
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  })

const HomeScreen = ({ navigation }) => {
  const themedStyles = useThemed(styles)
  const [clipboardUrl, setClipboardUrl] = useState(null)

  const appState = useRef(AppState.currentState)

  useEffect(() => {
    async function checkForUrlInClipboard() {
      const text = await Clipboard.getString()

      try {
        const url = new URL(text)
        setClipboardUrl(url.href)
      } catch {
        setClipboardUrl(null)
      }
    }

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          checkForUrlInClipboard()
        }

        appState.current = nextAppState
      },
    )

    checkForUrlInClipboard()

    return () => {
      subscription.remove()
    }
  }, [])

  const articles = [
    {
      title: 'Bitcoin is Time',
      subtitle: 'dergigi.com',
      url: 'https://dergigi.com/2021/01/14/bitcoin-is-time/',
    },
    {
      title: 'Shareholder Letter',
      subtitle: 'seetee.io',
      url: 'https://www.seetee.io/blog/2021-03-08-shareholder-letter/',
    },
  ]

  return (
    <SafeAreaView style={themedStyles.background}>
      <View style={themedStyles.container}>
        {articles.map((article, index) => (
          <View key={index} style={themedStyles.articleContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('Reader', { url: article.url })
              }}>
              <Text style={themedStyles.articleTitle}>{article.title}</Text>
              <Text style={themedStyles.articleSubtitle}>
                {article.subtitle}
              </Text>
            </Pressable>
          </View>
        ))}
        {clipboardUrl && (
          <View style={themedStyles.articleContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('Reader', { url: clipboardUrl })
              }}>
              <Text
                style={[
                  themedStyles.articleTitle,
                  themedStyles.clipbardArticleTitle,
                ]}>
                Suggested from Clipboard
              </Text>
              <Text style={themedStyles.clipboardUrl}>{clipboardUrl}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
