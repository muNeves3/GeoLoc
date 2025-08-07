import axios from 'axios';
import type { Centro, Edificio, Sala } from './types';


const apiClient = axios.create({
  baseURL: '', 
});

export const fetchCentros = async (): Promise<Centro[]> => {
  const response = await apiClient.get('/api/centro');
  return response.data;
};

export const fetchEdificios = async (): Promise<Edificio[]> => {
  const response = await apiClient.get('/api/edificios');
  return response.data;
};

export const fetchSalasPorEdificio = async (edificioId: string): Promise<Sala[]> => {
  if (!edificioId) return [];
  const response = await apiClient.get(`/api/sala/${edificioId}`);
  return response.data;
};

export const fetchRota = async (origemLat: number, origemLon: number, destinoId: string) => {
  console.log('Buscando rota de:', { origemLat, origemLon }, 'para sala com ID:', destinoId);
  
  const response = await apiClient.get(`/api/rotas?origemLat=${origemLat}&origemLon=${origemLon}&destinoId=${destinoId}`);

  return response.data
};