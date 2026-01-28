import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const DadosProcesso = () => {
  const route = useRoute();
  const { pi } = route.params || {};
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [processo, setProcesso] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!pi) {
      setErro("Nenhum número de processo informado");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);

    api.consultaDetalhada(
      pi,
      (response) => {
        // A API retorna um array, pegamos o primeiro item
        const dados = Array.isArray(response) && response.length > 0 ? response[0] : null;

        if (dados && typeof dados === "object") {
          setProcesso(dados);
        } else {
          setProcesso(null);
          setErro("Nenhum dado válido retornado pela API");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro na API:", error);
        setErro("Falha ao consultar o processo");
        setLoading(false);
      }
    );
  }, [pi]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F2CF7A" />
        <Text style={styles.loadingText}>Buscando informações...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{erro}</Text>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* HEADER COM GRADIENTE COBRINDO O TOPO */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#F2CF7A', '#fff']}
          useAngle
          angle={130}
          style={styles.gradient}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name='arrow-back' size={28} color="#0f172a" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Processo {pi}</Text>

            <Text style={styles.headerCode}>{processo?.cliente_codigo || "000"}</Text>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* LOCALIZAÇÃO */}
        <View style={styles.localContainer}>
          <Ionicons name="location-sharp" size={20} color="#F2CF7A" />
          <Text style={styles.localText}>
            {processo?.local || "Local não informado"}
          </Text>
        </View>

        {/* CARD DE DETALHES */}
        <View style={styles.card}>
          <Text style={styles.title}>{processo?.RoteiroDesc || "Sem Descrição"}</Text>
          
          <Text style={styles.sectionTitle}>Detalhes do Processo</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Cadastro: </Text>
            <Text style={styles.value}>{processo?.Data_Cadastro || '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Código do Cliente: </Text>
            <Text style={styles.value}>{processo?.cliente_codigo || '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nome Cliente: </Text>
            <Text style={styles.value}>{processo?.cliente_titular || '—'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Descrição: </Text>
            <Text style={styles.value}>{processo?.objeto || '—'}</Text>
          </View>
        </View>

        {/* CARD DE ANDAMENTO */}
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: '#F2CF7A' }]}>Andamento</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>
              {processo?.processo_concluido?.toLowerCase() === "s" ? "Concluído" : "Não Concluído"}
            </Text>
          </View>

          <View style={styles.subCard}>
            <Text style={styles.subCardText}>{processo?.RoteiroDesc}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    height: 130, // Altura do Header
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  headerCode: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  localContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 5,
    width: '100%',
    alignSelf: 'flex-start',
  },
  localText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '600',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    width: '90%',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E8C675",
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    color: '#475569',
    fontSize: 15,
  },
  value: {
    color: '#1e293b',
    fontSize: 15,
    flex: 1,
  },
  subCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E8C675',
  },
  subCardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#E8C675',
    fontWeight: '600'
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20
  },
  btnVoltar: {
    backgroundColor: '#E8C675',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8
  }
});

export default DadosProcesso;