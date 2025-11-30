import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import FormularioLocal from './telas/FormularioLocal';
import MapaRota from './telas/MapaRota';
import TelaRotasRecentes from './telas/RotasRecentes'; 

import { RouteProvider } from './RouteContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Formulario" 
        component={FormularioLocal} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RotasRecentes" 
        component={TelaRotasRecentes} 
        options={{ 
          title: 'Histórico de Rotas',
          headerBackTitle: 'Voltar', 
          headerTintColor: '#2563eb' 
        }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <RouteProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              height: 85,
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              paddingTop: 6,
              elevation: 5, 
              padding: 10,
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'home';

              if (route.name === 'Início') {
                iconName = focused ? 'navigate' : 'navigate-outline';
              } else if (route.name === 'Mapa') {
                iconName = focused ? 'map' : 'map-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Início" component={HomeStackNavigator} />
          
          <Tab.Screen name="Mapa" component={MapaRota} />
        </Tab.Navigator>

      </NavigationContainer>
    </RouteProvider>
  );
}