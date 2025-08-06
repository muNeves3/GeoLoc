import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { Edificio, Sala } from './types';

interface MapComponentProps {
  edificios: Edificio[];
  selectedSala: Sala | null;
  rota: LatLngExpression[] | null;
}

function MapComponent({ edificios, selectedSala, rota }: MapComponentProps) {
  const centroUEL: LatLngExpression = [-23.324, -51.196];

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
        {rota && <Polyline pathOptions={{ color: 'blue' }} positions={rota} />}

      </MapContainer>
    </div>
  );
}

export default MapComponent;