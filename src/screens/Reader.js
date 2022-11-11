import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'

import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
  defaultSystemFonts,
} from 'react-native-render-html'

import { useThemed } from '../hooks/useThemed'
import { useTheme } from '../theme/theme'

const styles = theme =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.colors.readerBackground,
    },
    centeredContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.m,
    },
    title: {
      fontFamily: theme.text.title1.family,
      fontSize: theme.text.title1.size,
      fontWeight: theme.text.title1.weight,
      marginTop: theme.spacing.l,
      color: theme.colors.readerForeground,
    },
    subtitle: {
      fontFamily: theme.text.headline.family,
      fontSize: theme.text.headline.size,
      fontWeight: theme.text.headline.weight,
      color: theme.colors.gray,
      marginBottom: theme.spacing.m,
    },
    article: {
      paddingBottom: theme.spacing.m,
    },
  })

const customHTMLElementModels = {
  center: HTMLElementModel.fromCustomModel({
    tagName: 'center',
    contentModel: HTMLContentModel.block,
  }),
}

const ReaderScreen = ({ route, navigation }) => {
  const { url } = route.params

  const theme = useTheme()
  const themedStyles = useThemed(styles)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [article, setArticle] = useState(null)
  const { width } = useWindowDimensions()

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true)
      setError(null)

      const encodedUrl = encodeURIComponent(url)
      const fetchUrl = `http://192.168.178.68:3000/upcycle?url=${encodedUrl}`

      try {
        const response = await fetch(fetchUrl)
        const json = await response.json()

        setArticle(json)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [url, navigation])

  if (error) {
    return (
      <SafeAreaView
        style={[themedStyles.background, themedStyles.centeredContainer]}>
        <Text>💔 Failed to load article.</Text>
      </SafeAreaView>
    )
  }

  if (isLoading || !article) {
    return (
      <SafeAreaView
        style={[themedStyles.background, themedStyles.centeredContainer]}>
        <ActivityIndicator animating={true} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[themedStyles.background]}>
      <ScrollView style={[themedStyles.textContainer]}>
        <Text style={[themedStyles.title]}>{article._data.title}</Text>
        <Text style={[themedStyles.subtitle]}>{article._data.hostname}</Text>
        <View style={[themedStyles.article]}>
          <RenderHtml
            contentWidth={width - 2 * theme.spacing.m}
            customHTMLElementModels={customHTMLElementModels}
            ignoredDomTags={['audio', 'hr']}
            source={{ html: article._data.html }}
            systemFonts={[
              ...defaultSystemFonts,
              'System',
              theme.text.reader.family,
            ]}
            tagsStyles={{
              h2: {
                fontFamily: theme.text.title2.family,
                fontSize: theme.text.title2.size,
                fontWeight: theme.text.title2.weight,
              },
              h3: {
                fontFamily: theme.text.title3.family,
                fontSize: theme.text.title3.size,
                fontWeight: theme.text.title3.weight,
              },
              p: {
                fontFamily: theme.text.reader.family,
                fontSize: theme.text.reader.size,
                fontWeight: theme.text.reader.weight,
                lineHeight: theme.text.reader.size * 1.3,
              },
              ul: {
                fontFamily: theme.text.reader.family,
                fontSize: theme.text.reader.size,
                fontWeight: theme.text.reader.weight,
                lineHeight: theme.text.reader.size * 1.3,
              },
              ol: {
                fontFamily: theme.text.reader.family,
                fontSize: theme.text.reader.size,
                fontWeight: theme.text.reader.weight,
                lineHeight: theme.text.reader.size * 1.3,
              },
              table: {
                fontFamily: theme.text.reader.family,
                fontSize: theme.text.reader.size,
                fontWeight: theme.text.reader.weight,
                lineHeight: theme.text.reader.size * 1.3,
              },
              blockquote: {
                fontStyle: 'italic',
                lineHeight: theme.text.reader.size,
              },
              a: {
                textDecorationColor: theme.colors.readerForeground,
                fontStyle: 'italic',
                color: theme.colors.readerForeground,
              },
            }}
            classesStyles={{ page: { color: theme.colors.readerForeground } }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReaderScreen
