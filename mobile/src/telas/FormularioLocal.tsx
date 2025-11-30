import React, { useState, useEffect } from 'react';
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
import { Centro, Edificio, RotasRecentes, Sala } from '../types';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function FormularioLocal() {
    const navigation = useNavigation<any>();
    
    // Pegamos as funções do contexto para salvar o histórico e a rota atual
    const { setRotasRecentes, rotasRecentes, setCurrentRoute } = useRouteContext();

    const [locExpo, setLocExpo] = useState<Location.LocationObject>();
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    
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
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') return;
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

    const handleGetLocation = async () => {
        setGpsLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de acesso ao GPS.');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setLocExpo(location);
            setOrigemCoords({
                lat: location.coords.latitude.toString(),
                lon: location.coords.longitude.toString()
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter sua localização.');
        } finally {
            setGpsLoading(false);
        }
    };

    const processarRota = (rotaBruta: number[][], latOrigem: number, lonOrigem: number) => {
        const pathFormatado = rotaBruta.map((ponto) => ({
            latitude: ponto[1],  // Índice 1 é LATITUDE
            longitude: ponto[0]  // Índice 0 é LONGITUDE
        }));

        const salaDestino = salas.find(s => s.id === selectedSalaId);
        const edificioDestino = edificios.find(e => e.id === selectedEdificioId);

        const nomeDestino = salaDestino ? `${salaDestino.numero} - ${salaDestino.nome}` : edificioDestino ? edificioDestino.nome : 'Destino';
        console.log('Nome do Destino:', nomeDestino);
        const novaRota = {
            id: Math.random().toString(),
            name: `Rota para ${nomeDestino}`,
            origin: {
                latitude: latOrigem,
                longitude: lonOrigem
            },
            destination: pathFormatado[pathFormatado.length - 1],
            path: pathFormatado
        };

        const novaRotaRecente: RotasRecentes = {
            id: novaRota.id,
            origem: `(${latOrigem.toFixed(4)}, ${lonOrigem.toFixed(4)})`,
            destino: nomeDestino,
        };

        const novasRotasRecentes = [novaRotaRecente, ...rotasRecentes];
        setRotasRecentes(novasRotasRecentes);
        setCurrentRoute(novaRota);
        navigation.navigate('Mapa');
    };

    const handleCriarRota = async () => {
        if (!origemCoords.lat || !origemCoords.lon) {
            Alert.alert('Campos Incompletos', 'Preencha todos os campos.');
            return;
        }

        try {
            setLoading(true);
            const lat = parseFloat(origemCoords.lat);
            const lon = parseFloat(origemCoords.lon);
            console.log('Criando rota de:', { lat, lon }, 'para edifício ID:', selectedEdificioId, 'e sala ID:', selectedSalaId);
            let rotaBruta : any;
            if(selectedSalaId !== '') {
                rotaBruta = await fetchRota(lat, lon, selectedSalaId);
            } else {
                if(selectedSalaId === '') {
                    rotaBruta = await fetchRota(lat, lon, selectedEdificioId);
                } else if(selectedEdificioId === '') {
                    Alert.alert('Atenção', 'Selecione um edifício de destino.');
                    return;
                }
            }


            if (rotaBruta && rotaBruta.length > 0) {
                processarRota(rotaBruta, lat, lon);
            } else {
                Alert.alert('Erro', 'Rota não encontrada.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar a rota.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Planejador</Text>
                        <Text style={styles.subtitle}>Encontre seu caminho</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.historyButton}
                        onPress={() => navigation.navigate('RotasRecentes')}
                    >
                        <Ionicons name="time-outline" size={24} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                {/* Card de Seleção de Destino */}
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
                            {salas && salas.map(s => (
                                <Picker.Item key={s.id} label={`${s.numero} - ${s.nome}`} value={s.id} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Local de saída</Text>
                    
                    <TouchableOpacity 
                        style={styles.gpsButton} 
                        onPress={handleGetLocation}
                        disabled={gpsLoading}
                    >
                        {gpsLoading ? (
                            <ActivityIndicator size="small" color="#2563eb" />
                        ) : (
                            <>
                                <Ionicons name="location" size={20} color="#2563eb" style={{ marginRight: 8 }} />
                                <Text style={styles.gpsButtonText}>Usar Localização Atual</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.helperText}>Ou insira manualmente:</Text>
                    
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

                {/* Botões de Ação */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCriarRota}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gerar Rota</Text>}
                </TouchableOpacity>
                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    scrollContainer: { padding: 20 },
    headerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24, 
        marginTop: 10 
    },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
    subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
    historyButton: { 
        backgroundColor: '#fff', 
        padding: 10, 
        borderRadius: 50, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        elevation: 3 
    },
    card: { 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 20, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        elevation: 3 
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#334155', 
        marginBottom: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f1f5f9', 
        paddingBottom: 8 
    },
    label: { fontSize: 14, fontWeight: '500', color: '#475569', marginBottom: 8, marginTop: 4 },
    pickerContainer: { 
        borderWidth: 1, 
        borderColor: '#e2e8f0', 
        borderRadius: 8, 
        marginBottom: 16, 
        backgroundColor: '#f8fafc', 
        height: 50, 
        justifyContent: 'center' 
    },
    disabledPicker: { backgroundColor: '#e2e8f0', borderColor: '#cbd5e1', opacity: 0.6 },
    picker: { width: '100%' },
    helperText: { fontSize: 13, color: '#94a3b8', marginBottom: 12, marginTop: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    inputGroup: { width: '48%' },
    input: { 
        height: 50, 
        backgroundColor: '#f8fafc', 
        borderWidth: 1, 
        borderColor: '#e2e8f0', 
        borderRadius: 8, 
        paddingHorizontal: 12, 
        fontSize: 16, 
        color: '#334155' 
    },
    gpsButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#eff6ff', 
        borderColor: '#bfdbfe', 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 8 
    },
    gpsButtonText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
    button: { 
        backgroundColor: '#2563eb', 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        shadowColor: "#2563eb", 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, 
        elevation: 8 
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    footerSpace: { height: 40 }
});