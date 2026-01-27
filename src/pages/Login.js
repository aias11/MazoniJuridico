import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import AuthContext from '../services/authContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo1 from '../assets/Logo1.png'
import LinearGradient from 'react-native-linear-gradient';




const Login = () => {
  const navigation = useNavigation()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);

  const { signIn } = React.useContext(AuthContext);

  useEffect(() => {
    const loadCredentials = async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
      }
    };
    loadCredentials();
  }, []);

    useEffect(() => {
      api.consultaProcesso(
        (response) => {
          console.log('Consulta processo sucesso:', response);
        })
      }, [])

  const onLogin = async () => {
    
    try {
      setSpinnerVisible(true);
      setError(false);
      setErrorMessage('');

      const Senha = '*J*' + password;

      await new Promise((resolve, reject) => {
        api.getToken(
          username,
          Senha,
          async () => {
            try {
              await AsyncStorage.setItem('usuario', username);
              await AsyncStorage.setItem('senha', password);

              const token = await AsyncStorage.getItem('token');

              await signIn(token);

              resolve();
            } catch (innerErr) {
              reject(innerErr);
            }
          },
          (err) => {
            reject(err);
          }
        )
      });

      setSpinnerVisible(false)

    } catch (err) {
      setSpinnerVisible(false);
      setError(true);
      const msg = typeof err === 'string' ? err : 'Falha no login. Verifique seus dados.'
      setErrorMessage(msg);
      ToastAndroid.show(msg, ToastAndroid.LONG)

    }
  }

  return (
    <LinearGradient
      colors={['#F2CF7A', '#fff']}
      useAngle={true}
      angle={130}
      angleCenter={{ x: 0.35, y: 0.35 }}
      
      style={styles.gradientContainer}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            bounces={false}
          >

            <Image source={Logo1} style={styles.logo} />

            <View style={styles.inputWrapper}>
              <Icon name="person-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Login"
                placeholderTextColor="#999"
                style={styles.inputField}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Senha"
                secureTextEntry={true}
                placeholderTextColor="#999"
                style={styles.inputField}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.containerBotao} onPress={onLogin}>
              <View style={styles.botao}>
                <Text style={styles.textoBotao}>Entrar</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer:{
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '85%',
    height: 55,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: '100%',
    color: '#000',
  },
  containerBotao: {
    width: '100%',
    alignItems: 'center',
  },
  botao: {
    width: '40%',
    height: 55,
    backgroundColor: '#E8C675',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  logo: {
    width: '90%',
    height: '30%'
  }
});

export default Login;