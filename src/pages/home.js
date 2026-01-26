import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthContext from '../services/authContext';


const Home = () => {

  useEffect(() => {
    const getStoredToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('Token na Home:', token);
    };
    getStoredToken();
  }, []);

  const { signOut } = React.useContext(AuthContext);

  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={signOut}>
        <Icon name='logout' size={20} color={'#000'}/>
      </TouchableOpacity>
      <Text>Logado com sucesso!</Text>
    </View>
  );
};
export default Home