import React from 'react'
import { useColorScheme } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/Home'
import ReaderScreen from './screens/Reader'
import { ThemeContext, lightTheme, darkTheme } from './theme/theme'

const Stack = createNativeStackNavigator()

const App = () => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '📚 VAT Prototype',
              headerTintColor: theme.colors.foreground,
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          />
          <Stack.Screen
            name="Reader"
            component={ReaderScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  )
}

export default App
