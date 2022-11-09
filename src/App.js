import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import ReaderScreen from './screens/Reader';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '📄 Prototype',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{headerBackTitle: 'Back', title: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
