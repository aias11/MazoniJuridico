import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Login from './pages/Login';
import Home from './pages/home'

const Stack = createStackNavigator();

export default function Routes({ userToken }) { 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen name="Home" component={Home} />
      )}
    </Stack.Navigator>
  );
}