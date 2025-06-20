import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNearbyIncidents } from '../services/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Geocoding component
const Geocoder = ({ location, onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    // Simulated geocoding
    // In a real application, use a geocoding service like Mapbox, Google Maps, or Nominatim
    setTimeout(() => {
      // Default location (sample)
      const position = [40.7128, -74.0060];
      map.setView(position, 13);
      onLocationFound({ lat: position[0], lng: position[1] });
    }, 1000);

  }, [location, map, onLocationFound]);

  return null;
};

const MapComponent = ({ location }) => {
  const [mapPosition, setMapPosition] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);

  const handleLocationFound = async (position) => {
    setMapPosition([position.lat, position.lng]);
    setIsLoading(false);

    try {
      const response = await getNearbyIncidents(position.lat, position.lng);
      if (response.data.success) {
        setIncidents(response.data.incidents || []);
        setStats(response.data.statistics);
      }
    } catch (err) {
      console.error('Error loading nearby incidents', err);
    }
  };

  if (isLoading) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      {stats && (
        <div className="row mb-3">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3>{stats.total_incidents}</h3>
                <p>Total Incidents</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3>{stats.recent_incidents}</h3>
                <p>Recent (30 days)</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3>{stats.severity_level}</h3>
                <p>Area Risk Level</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3>{stats.common_type}</h3>
                <p>Common Incident</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={mapPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={mapPosition}>
          <Popup>
            {location || 'Selected Location'}
          </Popup>
        </Marker>

        <Geocoder location={location} onLocationFound={handleLocationFound} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;