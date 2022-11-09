import React from 'react';
import {SafeAreaView, Text, Button, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  url: {
    fontFamily: 'Courier New',
    fontSize: 12,
  },
});

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={[styles.url]}>
        https://dergigi.com/2021/01/14/bitcoin-is-time
      </Text>
      <Button
        title="Read 'Bitcoin is Time'"
        onPress={() =>
          navigation.navigate('Reader', {
            articleUrl: 'https://dergigi.com/2021/01/14/bitcoin-is-time',
          })
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
