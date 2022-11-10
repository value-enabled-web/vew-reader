import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import BigButton from '../components/BigButton';
import {useThemed} from '../hooks/useThemed';

const styles = theme =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.m,
    },
    top: {
      flex: 1,
    },
    urlContainer: {
      backgroundColor: theme.colors.white,
      padding: theme.spacing.m,
      borderRadius: 8,
      shadowColor: 'black',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    url: {
      fontFamily: theme.fonts.monospaced.family,
      fontWeight: theme.fonts.monospaced.weight,
      fontSize: theme.fonts.monospaced.size,
      color: theme.colors.foreground,
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  });

const HomeScreen = ({navigation}) => {
  const themedStyles = useThemed(styles);

  const articleUrl = 'https://dergigi.com/2021/01/14/bitcoin-is-time/';

  return (
    <SafeAreaView style={themedStyles.background}>
      <View style={themedStyles.container}>
        <View style={themedStyles.top} />
        <View style={themedStyles.urlContainer}>
          <Text style={themedStyles.url}>{articleUrl}</Text>
        </View>
        <View style={themedStyles.bottom}>
          <BigButton
            title="Read"
            onPress={() =>
              navigation.navigate('Reader', {
                articleUrl,
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
