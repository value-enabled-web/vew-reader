import React from 'react'
import { useColorScheme, Pressable } from 'react-native'
import { StyleSheet } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/MaterialIcons'

import AccountScreen from './screens/Account'
import HomeScreen from './screens/Home'
import ReaderScreen from './screens/Reader'
import { ThemeContext, lightTheme, darkTheme } from './theme/theme'

const Stack = createNativeStackNavigator()

const App = () => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme
  const themedStyles = styles(theme)

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Monocle',
              headerTintColor: theme.colors.foreground,
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerRight: () => (
                <Pressable
                  onPress={() => navigation.navigate('Account')}
                  color={theme.colors.foreground}>
                  <Icon
                    style={themedStyles.navibationBarButton}
                    name="settings"
                  />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Reader"
            component={ReaderScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Account"
            component={AccountScreen}
            options={({ navigation }) => ({
              presentation: 'formSheet',
              headerStyle: { backgroundColor: theme.colors.background },
              headerTintColor: theme.colors.foreground,
              headerShadowVisible: false,
              title: 'Account',
              headerRight: () => (
                <Pressable
                  onPress={() => navigation.goBack()}
                  color={theme.colors.foreground}>
                  <Icon style={themedStyles.navibationBarButton} name="close" />
                </Pressable>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  )
}

const styles = theme =>
  StyleSheet.create({
    navibationBarButton: { color: theme.colors.foreground, fontSize: 20 },
  })

export default App
