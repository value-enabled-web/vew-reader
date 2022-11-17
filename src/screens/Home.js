import React, { useEffect, useState, useRef } from 'react'
import {
  AppState,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native'

import Clipboard from '@react-native-clipboard/clipboard'

import {
  hardcodedArticles as articles,
  enableClipboardSuggestions,
} from '../../app.json'
import { useThemed } from '../hooks/useThemed'

const styles = theme =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContentContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      padding: theme.spacing.m,
    },
    heading: {
      fontFamily: theme.text.title2.family,
      fontWeight: theme.text.title2.weight,
      fontSize: theme.text.title2.size,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.m,
    },
    articleContainer: {
      backgroundColor: theme.colors.backgroundHighlighted,
      padding: theme.spacing.m,
      borderRadius: theme.cornerRadius,
      shadowColor: theme.dropShadow.color,
      shadowOffset: theme.dropShadow.offset,
      shadowOpacity: theme.dropShadow.opacity,
      shadowRadius: theme.dropShadow.radius,
      elevation: 1,
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
      color: theme.colors.foreground,
      marginBottom: theme.spacing.s,
    },
    clipboardUrl: {
      fontFamily: theme.text.footnoteMono.family,
      fontWeight: theme.text.footnoteMono.weight,
      fontSize: theme.text.footnoteMono.size,
      color: theme.colors.foreground,
    },
    savedArticlesContainer: {},
    clipbardSuggestionContainer: {},
  })

const HomeScreen = ({ navigation }) => {
  const themedStyles = useThemed(styles)
  const [clipboardUrl, setClipboardUrl] = useState(
    'https://dergigi.com/2021/01/14/bitcoin-is-time/',
  )

  const appState = useRef(AppState.currentState)

  useEffect(() => {
    if (!enableClipboardSuggestions) {
      setClipboardUrl(null)
      return
    }

    async function checkForUrlInClipboard() {
      const hasString = await Clipboard.hasString()
      const probablyHasWebURL =
        Platform.OS === 'ios' ? await Clipboard.hasWebURL() : true

      if (!hasString || !probablyHasWebURL) {
        setClipboardUrl(null)
        return
      }

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
          await checkForUrlInClipboard()
        }

        appState.current = nextAppState
      },
    )

    checkForUrlInClipboard()

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <SafeAreaView style={themedStyles.background}>
      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollViewContentContainer}>
        <View style={themedStyles.savedArticlesContainer}>
          <Text style={themedStyles.heading}>📥 Articles</Text>
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
        </View>
        <View style={themedStyles.clipbardSuggestionContainer}>
          {enableClipboardSuggestions && clipboardUrl && (
            <View>
              <Text style={themedStyles.heading}>📋 Clipboard</Text>
              <View style={themedStyles.articleContainer}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Reader', { url: clipboardUrl })
                  }}>
                  <Text style={themedStyles.clipboardUrl}>{clipboardUrl}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
