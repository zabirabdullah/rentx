import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet icons not showing up due to webpack/vite issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const PropertyMapSection = ({ properties }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const categories = ['All', 'House', 'Office', 'Commercial', 'Godown', 'Garage', 'ATM Booth'];

  // Default center
  const center = [51.505, -0.09];

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.type === activeCategory));
    }
  }, [activeCategory, properties]);

  // Create custom icon
  const createCustomIcon = (property) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="custom-marker-badge">${property.type} - ${property.price}</div>`,
      iconSize: [100, 30],
      iconAnchor: [50, 35],
      popupAnchor: [0, -35]
    });
  };

  const handleCenterMap = () => {
    // In a real app, this would use navigator.geolocation
    alert('Centering on your location (simulated)');
  };

  return (
    <section id="map" className="map-section relative z-10 pt-20">
      <div className="container">
        <h2 className="section-title">Explore on Map</h2>
        <p className="section-subtitle">Find properties exactly where you want them.</p>

        <div className="map-filter-bar">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={handleCenterMap}>
            Center on My Location
          </button>
        </div>

        <div className="map-container">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={center} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {filteredProperties.map(property => (
              <Marker 
                key={property.id} 
                position={[property.lat, property.lng]}
                icon={createCustomIcon(property)}
              >
                <Popup>
                  <div className="property-popup">
                    <img src={property.image} alt={property.title} className="property-popup-img" />
                    <div className="property-popup-info">
                      <h3 className="property-popup-title">{property.title}</h3>
                      <p className="property-popup-address">{property.address}</p>
                      <p className="property-popup-specs">{property.specs}</p>
                      <span className={`status-pill ${property.status === 'Available' ? 'status-available' : 'status-pending'}`}>
                        {property.status}
                      </span>
                      <button className="popup-btn">View Details</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default PropertyMapSection;
