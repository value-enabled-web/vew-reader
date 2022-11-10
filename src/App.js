import React from 'react'
import { useColorScheme } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/Home'
import ReaderScreen from './screens/Reader'
import { ThemeContext, theme, darkTheme } from './theme/theme'

const Stack = createNativeStackNavigator()

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <ThemeContext.Provider value={isDarkMode ? darkTheme : theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '📚 VAT Prototype',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          />
          <Stack.Screen
            name="Reader"
            component={ReaderScreen}
            options={{ headerBackTitle: 'Back', title: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  )
}

export default App
