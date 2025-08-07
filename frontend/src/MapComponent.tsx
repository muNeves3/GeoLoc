import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import type { LatLng, LatLngExpression } from 'leaflet';
import type { Edificio, Sala } from './types';
import { useMemo } from 'react';
import MapClickHandler from './MapClickHandler';
import L from 'leaflet';

interface MapComponentProps {
  edificios: Edificio[];
  selectedSala: Sala | null;
  rota: LatLngExpression[] | null;
  onMapClick: (coords: LatLng) => void;   
  origemCoords: { lat: string; lon: string };
}

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapComponent({ edificios, selectedSala, rota, onMapClick, origemCoords}: MapComponentProps) {
  const centroUEL: LatLngExpression = [-23.324, -51.196];

  const startMarkerPosition = useMemo((): LatLngExpression | null => {
    const lat = parseFloat(origemCoords.lat);
    const lon = parseFloat(origemCoords.lon);
    return !isNaN(lat) && !isNaN(lon) ? [lat, lon] : null;
  }, [origemCoords]);


  return (
    <div className="h-full w-full rounded-lg shadow-lg">
      <MapContainer center={centroUEL} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {edificios.map(edificio => (
          <Marker key={edificio.id} position={[edificio.latitude, edificio.longitude]}>
            <Popup>{edificio.nome}</Popup>
          </Marker>
        ))}

        {selectedSala && (
          <Marker position={[selectedSala.latitude, selectedSala.longitude]}>
            <Popup>
              <strong>Destino:</strong> {selectedSala.nome} <br />
              Sala {selectedSala.numero}
            </Popup>
          </Marker>
        )}

        <MapClickHandler onMapClick={onMapClick} />
        {startMarkerPosition && (
          <Marker position={startMarkerPosition} icon={greenIcon}>
            <Popup>Ponto de Partida</Popup>
          </Marker>
        )}
        {rota && <Polyline pathOptions={{ color: 'blue' }} positions={rota} />}

      </MapContainer>
    </div>
  );
}

export default MapComponent;