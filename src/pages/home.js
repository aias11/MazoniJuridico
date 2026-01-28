import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../services/authContext';
import api from "../services/api";
import Logo1 from '../assets/Logo1.png';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


const Home = () => {

  const [processos, setProcessos] = useState([]);
  const [icone, setIcone] = useState('')
  const [cor, setCor] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const getStoredToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('Token na Home:', token);
    };
    getStoredToken();
  }, []);

  useEffect(() => {
    api.consultaProcesso((response) => {
      setProcessos(response);
    });
  }, []);

  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    if (processos.concluidoProcesso == true) {
      setIcone('check-circle-outline')
      setCor('#5f0')
    } else {
      setIcone('close-circle-outline')
      setCor('#f40')
    }
  })
  return (

    <View>
      {/* HEADER */}
      <View style={{ height: 150 }}>
        <LinearGradient
          colors={['#F2CF7A', '#fff']}
          useAngle
          angle={130}
          angleCenter={{ x: 0.35, y: 0.35 }}
          style={styles.gradientContainer}
        >
          <View style={{
            paddingTop: 55,
            paddingBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 20
          }}>
            <Image
              source={Logo1}
              style={styles.Image}
            />

            <TouchableOpacity onPress={signOut}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 6, fontSize: 20, fontWeight: 'bold' }}>Sair</Text>
                <MaterialIcons name="logout" size={30} color="#000" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.screen}>
          {processos.map((processo) => (
            <View
              key={processo.pi}
              style={styles.itemProcesso}
            >
              <View style={styles.container}>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 10
                }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                    {processo.RoteiroDesc}
                  </Text>
                  <Ionicons
                    name={icone}
                    size={40}
                    color={cor}
                  />
                </View>

                <Text style={{ fontSize: 14 }}>
                  {processo.contra}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={{ fontSize: 14 }}>
                    {processo.objeto}
                  </Text>

                  <Text style={{ fontSize: 18, alignSelf: 'flex-end' }}>
                    {processo.processo}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#F2CF7A', padding: 10, borderRadius: 8, paddingHorizontal: 20 }}
                    onPress={() => {
                      navigation.navigate('DadosProcesso', { pi: processo.pi })
                    }}>
                    <Text style={{ fontWeight: 'bold'}}>Visualizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  itemProcesso: {
    width: '90%',
    height: 170,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  Image: {
    width: 200,
    height: 70,
  },
});

export default Home;
