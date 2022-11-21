import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'

import Config from 'react-native-config'
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
  defaultSystemFonts,
} from 'react-native-render-html'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Pressable from '../components/Pressable'
import { useThemed } from '../hooks/useThemed'
import { useTheme } from '../theme/theme'

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
  const themedReaderStyles = useThemed(readerStyles)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [article, setArticle] = useState(null)
  const { width } = useWindowDimensions()

  const lastContentOffset = useSharedValue(0)
  const isScrolling = useSharedValue(false)
  const translateActionBarY = useSharedValue(0)

  const clapAnimationTextOffset = useSharedValue(0)
  const clapAnimationTextOpacity = useSharedValue(1)
  const clapAnimationDuration = 350
  const clapAnimationOffset = 250

  const clapTextAnimationStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -clapAnimationTextOffset.value,
        },
      ],
      opacity: clapAnimationTextOpacity.value,
    }
  })

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true)
      setError(null)

      const encodedUrl = encodeURIComponent(url)
      const fetchUrl = `${Config.VAT_API_URL}/upcycle?url=${encodedUrl}`

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

  const actionBarAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateActionBarY.value, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    }
  })

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        // scrolling up
        translateActionBarY.value = 0
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        // scrolling down
        translateActionBarY.value = 100
      }
      lastContentOffset.value = event.contentOffset.y
    },
    onBeginDrag: e => {
      isScrolling.value = true
    },
    onEndDrag: e => {
      isScrolling.value = false
    },
  })

  if (error) {
    return (
      <SafeAreaView
        style={[themedStyles.background, themedStyles.centeredContainer]}>
        <Text style={themedStyles.errorMessage}>
          💔 Failed to load article.
        </Text>
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
      <Animated.ScrollView
        scrollEventThrottle={64}
        style={[themedStyles.textContainer]}
        onScroll={scrollHandler}>
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
            tagsStyles={themedReaderStyles}
            classesStyles={{ page: { color: theme.colors.readerForeground } }}
          />
        </View>
      </Animated.ScrollView>
      <View>
        <Animated.View style={[themedStyles.actionBar, actionBarAnimation]}>
          <Pressable
            activeOpacity={0.5}
            style={themedStyles.actionBarItem}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={themedStyles.actionBarIcon} />
          </Pressable>
          <View style={themedStyles.actionBarDivider} />
          <Pressable
            activeOpacity={0.5}
            style={themedStyles.actionBarItem}
            onPress={() => {
              clapAnimationTextOffset.value = 0
              clapAnimationTextOpacity.value = 1
              clapAnimationTextOffset.value = withTiming(clapAnimationOffset, {
                duration: clapAnimationDuration,
              })
              clapAnimationTextOpacity.value = withTiming(0, {
                duration: clapAnimationDuration,
              })
            }}>
            <Icon name={'favorite-border'} style={themedStyles.actionBarIcon} />
            <View>
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  clapTextAnimationStyles,
                ]}>
                <Text style={themedStyles.actionBarText}>1k</Text>
              </Animated.View>
              <Text style={themedStyles.actionBarText}>1k</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

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
      zIndex: 0,
      elevation: 0,
    },
    errorMessage: {
      fontFamily: theme.text.headline.family,
      fontSize: theme.text.headline.size,
      fontWeight: theme.text.headline.weight,
      color: theme.colors.foreground,
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
    actionBar: {
      zIndex: 1,
      elevation: 1,
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: theme.colors.backgroundHighlighted,
      borderRadius: theme.cornerRadius * 3,
      bottom: theme.spacing.m,
      alignSelf: 'center',
      shadowColor: theme.colors.foreground,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    actionBarItem: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
    },
    actionBarIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 25,
      color: theme.colors.foreground,
    },
    actionBarText: {
      fontFamily: theme.text.body.family,
      fontSize: 15,
      fontWeight: theme.text.body.weight,
      color: theme.colors.foreground,
      marginLeft: 5,
    },
    actionBarDivider: {
      borderLeftColor: theme.colors.gray3,
      borderLeftWidth: 1,
      marginVertical: theme.spacing.s,
    },
  })

const readerStyles = theme => ({
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
})

export default ReaderScreen
