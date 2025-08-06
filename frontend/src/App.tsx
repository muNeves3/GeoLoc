import { useState, useEffect, useMemo } from 'react';
import { fetchCentros, fetchEdificios, fetchSalasPorEdificio, fetchRota } from './api';
import type { Centro, Edificio, Sala } from './types';
import MapComponent from './MapComponent';
import type { LatLngExpression } from 'leaflet';

function App() {

  const [centros, setCentros] = useState<Centro[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
 
  const [selectedCentroId, setSelectedCentroId] = useState<string>('');
  const [selectedEdificioId, setSelectedEdificioId] = useState<string>('');
  const [selectedSalaId, setSelectedSalaId] = useState<string>('');

  const [origemCoords, setOrigemCoords] = useState({ lat: '', lon: '' });
  const [rota, setRota] = useState<LatLngExpression[] | null>(null);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setCentros(await fetchCentros());
      setEdificios(await fetchEdificios());
    };
    carregarDadosIniciais();
  }, []);


  useEffect(() => {
    if (selectedEdificioId) {
      const carregarSalas = async () => {
        setSalas(await fetchSalasPorEdificio(selectedEdificioId));
      };
      carregarSalas();
    } else {
      setSalas([]); 
    }
  }, [selectedEdificioId]);
  
  const selectedSala = useMemo(() => {
    return salas.find(s => s.id === selectedSalaId) || null;
  }, [salas, selectedSalaId]);

  const handleCriarRota = async () => {
    if (!origemCoords.lat || !origemCoords.lon || !selectedSalaId) {
      alert('Por favor, preencha sua localização de partida e selecione uma sala de destino.');
      return;
    }
    const rotaCalculada: number[][] = await fetchRota(parseFloat(origemCoords.lat), parseFloat(origemCoords.lon), selectedSalaId);

    if (rotaCalculada && rotaCalculada.length > 0) {

      const rotaFormatadaParaLeaflet = rotaCalculada.map((ponto) => [ponto[1], ponto[0]]); 
      
      console.log("Rota formatada para o mapa:", rotaFormatadaParaLeaflet); 
      setRota(rotaFormatadaParaLeaflet as LatLngExpression[]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      <div className="w-full md:w-96 bg-white p-6 shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">GeoLoc UEL</h1>
        <p className="text-gray-600 mb-6">Encontre seu caminho no campus.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="centro" className="block text-sm font-medium text-gray-700">1. Selecione o Centro</label>
            <select id="centro" value={selectedCentroId} onChange={e => setSelectedCentroId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos os Centros</option>
              {centros.map(c => <option key={c.id} value={c.id}>{c.sigla} - {c.nome}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="edificio" className="block text-sm font-medium text-gray-700">2. Selecione o Edifício</label>
            <select id="edificio" value={selectedEdificioId} onChange={e => { setSelectedEdificioId(e.target.value); setSelectedSalaId(''); }} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Selecione um edifício</option>
              {edificios.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="sala" className="block text-sm font-medium text-gray-700">3. Selecione a Sala de Destino</label>
            <select id="sala" value={selectedSalaId} onChange={e => setSelectedSalaId(e.target.value)} disabled={!selectedEdificioId} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200">
              <option value="">Selecione uma sala</option>
              {salas.map(s => <option key={s.id} value={s.id}>{s.nome} (Nº {s.numero})</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold text-gray-800">Sua Localização</h2>
          <p className="text-sm text-gray-500 mb-4">Insira suas coordenadas de partida.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="text" id="lat" value={origemCoords.lat} onChange={e => setOrigemCoords({...origemCoords, lat: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="-23.324"/>
            </div>
            <div>
              <label htmlFor="lon" className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="text" id="lon" value={origemCoords.lon} onChange={e => setOrigemCoords({...origemCoords, lon: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="-51.196"/>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button onClick={handleCriarRota} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Criar Rota
          </button>
        </div>

      </div>

      <div className="flex-1 p-4">
        <MapComponent edificios={edificios} selectedSala={selectedSala} rota={rota} />
      </div>
    </div>
  );
}

export default App;