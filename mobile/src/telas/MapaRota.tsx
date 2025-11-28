import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouteContext } from '../RouteContext';

export default function MapaRota() {
    const { currentRoute } = useRouteContext();

    const UEL_COORDS = { latitude: -23.3251, longitude: -51.1963 };

    const initialRegion = {
        latitude: UEL_COORDS.latitude,
        longitude: UEL_COORDS.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true}
                loadingEnabled={true}
            >
                {currentRoute && (
                    <>
                        <Marker 
                            coordinate={currentRoute.origin} 
                            title="Origem" 
                            description="Ponto de partida"
                            pinColor="green" 
                        />
                        <Marker 
                            coordinate={currentRoute.destination} 
                            title="Destino"
                            description={currentRoute.name}
                        />

                        {currentRoute.path && (
                            <Polyline
                                coordinates={currentRoute.path}
                                strokeColor="#2563eb" // Azul primário combinando com o form
                                strokeWidth={5}
                                lineDashPattern={[1]} // Linha sólida
                            />
                        )}
                    </>
                )}
            </MapView>

            {/* Overlay de Informação da Rota */}
            {currentRoute && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Rota Ativa</Text>
                    <View style={styles.infoRow}>
                        <View style={[styles.dot, { backgroundColor: 'green' }]} />
                        <Text style={styles.infoText}>Início: {currentRoute.origin.latitude.toFixed(4)}, {currentRoute.origin.longitude.toFixed(4)}</Text>
                    </View>
                    <View style={styles.connector} />
                    <View style={styles.infoRow}>
                        <View style={[styles.dot, { backgroundColor: '#ea4335' }]} />
                        <Text style={styles.infoText}>{currentRoute.name}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
    infoBox: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#334155',
        marginLeft: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    connector: {
        width: 2,
        height: 12,
        backgroundColor: '#cbd5e1',
        marginLeft: 4,
        marginVertical: 2,
    }
});