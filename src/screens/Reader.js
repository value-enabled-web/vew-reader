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
} from 'react-native-render-html'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 35,
  },
  article: {
    paddingVertical: 10,
  },
})

const customHTMLElementModels = {
  center: HTMLElementModel.fromCustomModel({
    tagName: 'center',
    contentModel: HTMLContentModel.block,
  }),
}

const ReaderScreen = ({ route, navigation }) => {
  const { articleUrl } = route.params

  const { width } = useWindowDimensions()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [article, setArticle] = useState(null)

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true)
      setError(null)

      const encodedArticleUrl = encodeURIComponent(articleUrl)
      const fetchUrl = `http://192.168.178.68:3000/upcycle?url=${encodedArticleUrl}`

      try {
        const response = await fetch(fetchUrl)
        const json = await response.json()
        setArticle(json)

        navigation.setOptions({ title: json._data.title })
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [articleUrl, navigation])

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Failed to load article!</Text>
      </SafeAreaView>
    )
  }

  if (isLoading || !article) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={[styles.scrollView]}>
        <Text style={[styles.title]}>{article._data.title}</Text>
        <View style={[styles.article]}>
          <RenderHtml
            contentWidth={width - 20}
            customHTMLElementModels={customHTMLElementModels}
            ignoredDomTags={['audio']}
            source={{
              html: article._data.html,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReaderScreen
