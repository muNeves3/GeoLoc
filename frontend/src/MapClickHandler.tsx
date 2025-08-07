import { useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';

interface MapClickHandlerProps {
  onMapClick: (coords: LatLng) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
}

export default MapClickHandler;