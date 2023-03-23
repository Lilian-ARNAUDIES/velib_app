import React, { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

function App() {
  const [address, setAddress] = useState('');
  const [velibStations, setVelibStations] = useState([]);
  const [location, setLocation] = useState(null);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    // Envoi de la requête AJAX pour récupérer les stations Vélib autour de l'adresse saisie
    axios.post('http://127.0.0.1:5000/api/search', { address: address })
      .then(response => {
        console.log(response.data);
        setVelibStations(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    // Récupération de la position de l'adresse saisie
    axios.get('https://nominatim.openstreetmap.org/search?format=json&q=' + address)
      .then(response => {
        console.log(response.data[0]);
        setLocation(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div>
      <form onSubmit={handleSearch}>
        <label>
          Adresse :
          <input type="text" value={address} onChange={handleAddressChange} />
        </label>
        <button type="submit">Rechercher</button>
      </form>

      <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: '500px', width: '60%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {location && (
          <Marker position={[location.lat, location.lon]} icon={greenIcon}>
            <Popup>
              {"Votre position"}
            </Popup>
          </Marker>
        )}

        {velibStations.map(station_Velib => (
          <Marker position={[station_Velib.latitude, station_Velib.longitude]} key={station_Velib.station_name}>
            <Popup>
              {station_Velib.station_name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
