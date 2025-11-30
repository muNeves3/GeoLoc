import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouteContext } from '../RouteContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TelaRotasRecentes() {
  const { rotasRecentes, setCurrentRoute } = useRouteContext();
  const navigation = useNavigation<any>();

  const handleSelectRoute = (item: any) => {
    setCurrentRoute(item.rotaCompleta);
    navigation.navigate('Mapa');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Rotas</Text>
      </View>

      <FlatList
        data={rotasRecentes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>Nenhuma rota recente encontrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => {
              console.log('Rota selecionada:', item);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={24} color="#2563eb" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.routeTitle}>Para: {item.destino}</Text>
              <Text style={styles.routeSubtitle}>De: {item.origem}</Text>
            </View>
            {/* <Ionicons name="chevron-forward" size={20} color="#94a3b8" /> */}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  routeSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  }
});