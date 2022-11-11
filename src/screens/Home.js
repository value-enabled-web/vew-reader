import React from 'react'
import { SafeAreaView, Text, View, StyleSheet, Pressable } from 'react-native'

import BigButton from '../components/BigButton'
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
      borderRadius: 8,
      shadowColor: 'black',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    articleTitle: {
      fontFamily: theme.text.headline.family,
      fontWeight: theme.text.headline.weight,
      fontSize: theme.text.headline.size,
      color: theme.colors.foreground,
      marginBottom: 2,
    },
    articleUrl: {
      fontFamily: theme.fonts.monospaced.family,
      fontWeight: theme.text.footnote.weight,
      fontSize: theme.text.footnote.size,
      color: theme.colors.foreground,
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  })

const HomeScreen = ({ navigation }) => {
  const themedStyles = useThemed(styles)

  const article = {
    title: 'Bitcoin is Time',
    url: 'https://dergigi.com/2021/01/14/bitcoin-is-time/',
  }

  return (
    <SafeAreaView style={themedStyles.background}>
      <View style={themedStyles.container}>
        <Pressable
          style={themedStyles.articleContainer}
          onPress={() => {
            navigation.navigate('Reader', { url: article.url })
          }}>
          <Text style={themedStyles.articleTitle}>{article.title}</Text>
          <Text style={themedStyles.articleUrl}>{article.url}</Text>
        </Pressable>
        <View style={themedStyles.bottom}>
          <BigButton
            title="Read"
            onPress={() => navigation.navigate('Reader', { url: article.url })}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
