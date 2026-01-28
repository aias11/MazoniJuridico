import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useRoute } from '@react-navigation/native';
import api from "../services/api";

const DadosProcesso = () => {
  const route = useRoute()
  const { pi } = route.params;

  const [loading, setLoading] = useState(true)
  const [detalheProcesso, setDetalheProcesso] = useState([]);

  useEffect(() => {
    if (!pi) return;
    setLoading(true);

    api.consultaDetalhada(
      pi,
      (response) => {
        console.log(response)
        if (Array.isArray(response) && response.length > 0) {
          setDetalheProcesso(response[0]); 
        } else {
          setDetalheProcesso(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('erro na API', error);
        setLoading(false);
      }
    );
  }, [pi]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Buscando informações...</Text>
      </View>
    )
  }
  if (!detalheProcesso) {
    return (
      <View style={styles.center}>
        <Text>Nenhum detalhe encontrado para este processo.</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Local do Processo:</Text>
      <Text style={styles.value}>{detalheProcesso.Local}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  value: {
    fontSize: 16,
    color: '#333'
  }
});
export default DadosProcesso;