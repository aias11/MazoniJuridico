import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Login from './pages/Login';
import Home from './pages/home';
import DadosProcesso from './pages/dadosProcesso';

const Stack = createStackNavigator();

export default function Routes({ userToken }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="DadosProcesso" component={DadosProcesso} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}