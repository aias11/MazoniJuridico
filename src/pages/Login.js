import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import AuthContext from "../services/authContext";
import Icon from "react-native-vector-icons/Ionicons";
import Logo1 from "../assets/Logo1.png";
import LinearGradient from "react-native-linear-gradient";

const Login = () => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
      }
    };
    loadCredentials();
  }, []);

  const onLogin = async () => {
    Keyboard.dismiss();
    if (!username || !password) {
      Alert.alert("Erro", "Preencha usuário e senha.");
      return;
    }

    try {
      setSpinnerVisible(true);

      const Senha = "*J*" + password;

      await new Promise((resolve, reject) => {
        api.getToken(
          username,
          Senha,
          async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                reject("Token não recebido.");
                return;
              }

              await AsyncStorage.setItem("username", username);
              await signIn(token);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : "Falha no login. Verifique seus dados.";
      Alert.alert("Erro", msg);
    } finally {
      setSpinnerVisible(false);
    }
  };

  return (
    <LinearGradient
      colors={["#F2CF7A", "#fff"]}
      useAngle={true}
      angle={130}
      angleCenter={{ x: 0.35, y: 0.35 }}
      style={styles.gradientContainer}
    >
      <Spinner visible={spinnerVisible} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          bounces={false}
          keyboardShouldPersistTaps="handled">
          <Image source={Logo1} style={styles.logo} resizeMode="contain" />

          <View style={styles.inputWrapper}>
            <Icon
              name="person-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              placeholder="Login"
              placeholderTextColor="#999"
              style={styles.inputField}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "85%",
    height: 55,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: "100%",
    color: "#000",
  },
  containerBotao: {
    width: "100%",
    alignItems: "center",
  },
  botao: {
    width: "40%",
    height: 55,
    backgroundColor: "#E8C675",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logo: {
    width: "90%",
    height: 150,
    marginBottom: 30,
  },
});

export default Login;
