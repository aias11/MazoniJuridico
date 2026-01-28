import React, { useMemo, useReducer, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import FlashMessage from 'react-native-flash-message';
import Routes from './routes';
import AuthContext from './services/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return { ...prevState, userToken: action.token, isLoading: false };
        case 'SIGN_IN':
          return { ...prevState, userToken: action.token };
        case 'SIGN_OUT':
          return { ...prevState, userToken: null };
      }
    },
    { isLoading: true, userToken: null }
  )

  const authContext = useMemo(() => ({
    signIn: async (token) => {
      dispatch({ type: 'SIGN_IN', token });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('token');
      dispatch({ type: 'SIGN_OUT' })
    },
  }), []);

  useEffect(() => {
    api.setContext(authContext);

    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {
        console.log('Erro ao restaurar token');
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    };
    bootstrapAsync();
  }, [authContext]);

  if (state.isLoading) return null;

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
          <FlashMessage position="top" />
          <Routes userToken={state.userToken} />
        </NavigationContainer>

        <Toast />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;