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
  const [andamento, setAndamento] = useState([]);

  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    try {
      const [data] = dataISO.split('T');
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch (e) {
      return dataISO;
    }
  };

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
        const dados = Array.isArray(response) && response.length > 0 ? response[0] : null;

        if (dados && typeof dados === "object") {
          setProcesso(dados);
          if (Array.isArray(dados.Andamentos)) {
            setAndamento(dados.Andamentos);
          } else {
            setAndamento([]);
          }
        } else {
          setProcesso(null);
          setAndamento([]);
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

  useEffect(() => {
    console.log('Processo', processo);
    console.log('Andamento', andamento)
  }, [processo,andamento])

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

        <View style={styles.localContainer}>
          <Ionicons name="location-sharp" size={20} color="#F2CF7A" />
          <Text style={styles.localText}>
            {processo?.local || "Local não informado"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{processo?.RoteiroDesc || "Sem Descrição"}</Text>
          <Text style={styles.sectionTitle}>Detalhes do Processo</Text>

          {[
            { label: "Data de Cadastro: ", value: processo?.Data_Cadastro?.split(' ')[0]},
            { label: "Número do Processo: ", value: pi },
            { label: "Parte Contrária: ", value: processo?.contra_titular },
            { label: "Objeto: ", value: processo?.objeto }
          ].map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value || '—'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: '#E8C675' }]}>Andamento</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>
              {processo?.processo_concluido?.toLowerCase() === "s" ? "Concluído" : "Não Concluído"}
            </Text>
          </View>
            {andamento.map((item, index) => (
              <View key={index} style={styles.subCard}>
                <View style={styles.cardContent}>

          {andamento.map((item, index) => (
            <View key={index} style={styles.subCard}>
              <View style={styles.cardContent}>

                <View style={styles.leftColumn}>
                  <Text style={styles.operadorText} numberOfLines={2}>
                    {item?.andamento_operador}
                  </Text>
                  <Text style={styles.dataText}>
                    {formatarData(item?.andamento_data)}
                  </Text>
                </View>

                <View style={styles.divisorVertical} />

                <View style={styles.rightColumn}>
                  <Text style={styles.descricaoText}>
                    {item?.andamento_andamento}
                  </Text>
                </View>

                </View>
              </View>
            ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  headerContainer: {
    width: '100%',
    height: 130
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center'
  },
  headerCode: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right'
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center'
  },
  localContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    width: '100%'
  },
  localText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '600'
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    width: '90%',
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E8C675",
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b'
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  label: {
    ontWeight: 'bold',
    color: '#475569',
    fontSize: 15
  },
  value: {
    color: '#1e293b',
    fontSize: 15, flex: 1
  },
  subCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#E8C675',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'stretch', 
  },
  leftColumn: {
    width: 90, 
    justifyContent: 'center',
  },
  divisorVertical: {
    width: 1.5,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 15, 
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  operadorText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
  },
  dataText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
  },
  descricaoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
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