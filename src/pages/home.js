import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import AuthContext from "../services/authContext";
import api from "../services/api";
import Logo1 from "../assets/Logo1.png";

const Home = () => {
  const [processos, setProcessos] = useState([]);
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    const getStoredToken = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("Token na Home:", token);
    };
    getStoredToken();
  }, []);

  useEffect(() => {
    api.consultaProcesso((response) => {
      setProcessos(response || []);
    });
  }, []);

  const renderItem = ({ item: processo }) => {
    const concluido = processo.concluidoProcesso === true;

    return (
      <View style={styles.itemProcesso}>
        <View style={styles.container}>
          <View style={styles.rowBetween}>
            <Text style={styles.titulo}>
              {processo.RoteiroDesc}
            </Text>

            <Ionicons
              name={concluido ? "check-circle-outline" : "close-circle-outline"}
              size={40}
              color={concluido ? "#5f0" : "#f40"}
            />
          </View>

          <Text style={styles.texto}>
            {processo.contra}
          </Text>

          <Text style={styles.texto}>
            {processo.objeto}
          </Text>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <Text style={styles.numeroProcesso}>
              {processo.processo}
            </Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                navigation.navigate("DadosProcesso", { pi: processo.pi })
              }
            >
              <Text style={styles.botaoTexto}>Visualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 150 }}>
        <LinearGradient
          colors={["#F2CF7A", "#fff"]}
          useAngle
          angle={130}
          angleCenter={{ x: 0.35, y: 0.35 }}
          style={styles.gradientContainer}
        >
          <View style={styles.header}>
            <Image source={Logo1} style={styles.Image} />

            <TouchableOpacity onPress={signOut}>
              <View style={styles.logout}>
                <Text style={styles.logoutText}>Sair</Text>
                <MaterialIcons name="logout" size={30} color="#000" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={processos}
        keyExtractor={(item) => String(item.pi)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20, alignItems: 'ce' }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },

  header: {
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  Image: {
    width: 200,
    height: 70,
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    marginRight: 6,
    fontSize: 20,
    fontWeight: "bold",
  },

  listContent: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },

  itemProcesso: {
    width: "90%",
    height: 160,
    alignSelf: 'center',
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },

  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },

  texto: {
    fontSize: 14,
  },

  numeroProcesso: {
    fontSize: 18,
  },

  botao: {
    backgroundColor: "#F2CF7A",
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },

  botaoTexto: {
    fontWeight: "bold",
  },
});
