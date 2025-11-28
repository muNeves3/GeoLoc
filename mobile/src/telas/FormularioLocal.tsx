import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRouteContext } from '../RouteContext';
import { fetchCentros, fetchEdificios, fetchSalasPorEdificio, fetchRota } from '../api';
import { Centro, Edificio, Sala } from '../types';
import * as Location from 'expo-location';

export default function FormularioLocal() {
    const navigation = useNavigation<any>();
    const { setCurrentRoute } = useRouteContext();

    const [locExpo, setLocExpo] = useState<Location.LocationObject>();
    const [loading, setLoading] = useState(false);
    const [centros, setCentros] = useState<Centro[]>([]);
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);

    const [selectedCentroId, setSelectedCentroId] = useState<string>('');
    const [selectedEdificioId, setSelectedEdificioId] = useState<string>('');
    const [selectedSalaId, setSelectedSalaId] = useState<string>('');

    const [origemCoords, setOrigemCoords] = useState({ lat: '', lon: '' });

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const c = await fetchCentros();
                const e = await fetchEdificios();

                console.log("Centros carregados:", c);
                console.log("Edifícios carregados:", e);

                setCentros(c);
                setEdificios(e);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        };
        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        (async () => {
          // Request permission to access location
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return;
          }
    
          // Get the current position
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocExpo(currentLocation);
        })();
      }, []);

    useEffect(() => {
        if (selectedEdificioId) {
            const carregarSalas = async () => {
                try {
                    setSalas(await fetchSalasPorEdificio(selectedEdificioId));
                } catch (error) {
                    console.error(error);
                }
            };
            carregarSalas();
        } else {
            setSalas([]);
            setSelectedSalaId('');
        }
    }, [selectedEdificioId]);

    const handleCriarRota = async () => {
        if (!origemCoords.lat || !origemCoords.lon || !selectedSalaId) {
            Alert.alert('Campos Incompletos', 'Por favor, preencha a latitude, longitude e selecione uma sala de destino.');
            return;
        }

        try {
            setLoading(true);

            const rotaBruta = await fetchRota(
                parseFloat(origemCoords.lat),
                parseFloat(origemCoords.lon),
                selectedSalaId
            ) as number[][];

            if (rotaBruta && rotaBruta.length > 0) {
                const pathFormatado = rotaBruta.map((ponto) => ({
                    latitude: ponto[0],
                    longitude: ponto[1]
                }));

                const salaDestino = salas.find(s => s.id === selectedSalaId);

                const novaRota = {
                    id: Math.random().toString(),
                    name: `Rota para ${salaDestino?.nome || 'Destino'}`,
                    origin: {
                        latitude: parseFloat(origemCoords.lat),
                        longitude: parseFloat(origemCoords.lon)
                    },
                    destination: pathFormatado[pathFormatado.length - 1], // Último ponto é o destino
                    path: pathFormatado
                };
                setCurrentRoute(novaRota);
                navigation.navigate('Mapa');
            } else {
                Alert.alert('Erro', 'Não foi possível encontrar uma rota para o destino selecionado.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro de Conexão', 'Falha ao buscar a rota. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleCriarRotaLocAtual = async () => {
        try {
            setLoading(true);

            const rotaBruta = await fetchRota(
                parseFloat(locExpo?.coords.latitude?.toString() || '0'),
                parseFloat(locExpo?.coords.longitude?.toString() || '0'),
                selectedSalaId
            ) as number[][];

            if (rotaBruta && rotaBruta.length > 0) {
                const pathFormatado = rotaBruta.map((ponto) => ({
                    latitude: ponto[1],
                    longitude: ponto[0]
                }));

                const salaDestino = salas.find(s => s.id === selectedSalaId);

                const novaRota = {
                    id: Math.random().toString(),
                    name: `Rota para ${salaDestino?.nome || 'Destino'}`,
                    origin: {
                        latitude: parseFloat(locExpo?.coords.latitude?.toString() || '0'),
                        longitude:  parseFloat(locExpo?.coords.longitude?.toString() || '0')
                    },
                    destination: pathFormatado[pathFormatado.length - 1], // Último ponto é o destino
                    path: pathFormatado
                };
                setCurrentRoute(novaRota);
                navigation.navigate('Mapa');
            } else {
                Alert.alert('Erro', 'Não foi possível encontrar uma rota para o destino selecionado.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro de Conexão', 'Falha ao buscar a rota. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Planejador de Rotas</Text>
                    <Text style={styles.subtitle}>Encontre seu caminho no campus</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Destino</Text>
                    
                    <Text style={styles.label}>Centro</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedCentroId}
                            onValueChange={(itemValue) => setSelectedCentroId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um Centro" value="" color="#9ca3af"/>
                            {centros.map(c => (
                                <Picker.Item key={c.id} label={`${c.sigla} - ${c.nome}`} value={c.id} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Edifício</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedEdificioId}
                            onValueChange={(itemValue) => {
                                setSelectedEdificioId(itemValue);
                                setSelectedSalaId('');
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um Edifício" value="" color="#9ca3af"/>
                            {edificios.map(e => (
                                <Picker.Item key={e.id} label={e.nome} value={e.id} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Sala</Text>
                    <View style={[styles.pickerContainer, !selectedEdificioId && styles.disabledPicker]}>
                        <Picker
                            selectedValue={selectedSalaId}
                            onValueChange={(itemValue) => setSelectedSalaId(itemValue)}
                            enabled={!!selectedEdificioId}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione uma Sala" value="" color="#9ca3af"/>
                            {salas.map(s => (
                                <Picker.Item key={s.id} label={`${s.numero} - ${s.nome}`} value={s.id} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Local de saída</Text>
                    <Text style={styles.helperText}>Insira coordenadas manuais para teste.</Text>
                    
                    <View style={styles.row}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Latitude</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="-23.32..."
                                keyboardType="numeric"
                                value={origemCoords.lat}
                                onChangeText={(t) => setOrigemCoords({ ...origemCoords, lat: t })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Longitude</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="-51.19..."
                                keyboardType="numeric"
                                value={origemCoords.lon}
                                onChangeText={(t) => setOrigemCoords({ ...origemCoords, lon: t })}
                            />
                        </View>
                    </View>
                </View>

                {/* Botão de Ação */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCriarRota}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Gerar Rota</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCriarRotaLocAtual}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Gerar rota com minha localização atual</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollContainer: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        // Sombra
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        marginBottom: 8,
        marginTop: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f8fafc',
        height: 50,
        justifyContent: 'center',
    },
    disabledPicker: {
        backgroundColor: '#e2e8f0',
        borderColor: '#cbd5e1',
        opacity: 0.6,
    },
    picker: {
        width: '100%',
    },
    helperText: {
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        width: '48%',
    },
    input: {
        height: 50,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#334155',
    },
    button: {
        backgroundColor: '#2563eb',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#2563eb",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        marginTop: 4
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerSpace: {
        height: 40,
    }
});