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

// Component to recenter map and fit bounds
function ChangeView({ properties }) {
  const map = useMap();
  useEffect(() => {
    if (properties && properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [properties, map]);
  return null;
}

const PropertyMapSection = ({ properties }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const categories = [
    { label: 'All', value: 'All' },
    { label: 'House', value: 'house' },
    { label: 'Office', value: 'office' },
    { label: 'Commercial', value: 'commercial_space' },
    { label: 'Godown', value: 'godown' },
    { label: 'Garage', value: 'garage' },
    { label: 'ATM Booth', value: 'atm_booth' }
  ];

  // Default center (Chittagong, Bangladesh)
  const defaultCenter = [22.3569, 91.7832];

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, properties]);

  // Create custom icon
  const createCustomIcon = (property) => {
    const title = (property.category || 'property').replace('_', ' ');
    const price = property.rentPrice ? property.rentPrice.toLocaleString() : 'N/A';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="custom-marker-badge capitalize">${title} - ৳${price}</div>`,
      iconSize: [100, 30],
      iconAnchor: [50, 35],
      popupAnchor: [0, -35]
    });
  };

  const handleCenterMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Your location: ${position.coords.latitude}, ${position.coords.longitude}\nIn a full implementation, the map would recenter here.`);
        },
        () => alert('Unable to retrieve your location')
      );
    } else {
      alert('Geolocation not supported by this browser.');
    }
  };

  return (
    <section id="map" className="map-section relative z-10 pt-20">
      <div className="container">
        <h2 className="section-title">Explore on Map</h2>
        <p className="section-subtitle">Find properties exactly where you want them.</p>

        {properties.length === 0 && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4 text-center font-semibold">
            No properties found matching your search.
          </div>
        )}

        <div className="map-filter-bar">
          {categories.map(cat => (
            <button 
              key={cat.value} 
              className={`filter-pill ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
          <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={handleCenterMap}>
            My Location
          </button>
        </div>

        <div className="map-container">
          <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView properties={filteredProperties} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {filteredProperties.map(property => (
              <Marker 
                key={property._id} 
                position={[property.lat, property.lng]}
                icon={createCustomIcon(property)}
              >
                <Popup>
                  <div className="property-popup">
                    <img src={property.images?.[0] || 'https://via.placeholder.com/400'} alt={property.address} className="property-popup-img" />
                    <div className="property-popup-info">
                      <h3 className="property-popup-title truncate">{property.address || 'Unknown Address'}</h3>
                      <p className="property-popup-specs text-xs text-slate-500 mt-1 capitalize">{property.category?.replace('_', ' ')} · {property.area} sqft</p>
                      <p className="font-semibold text-slate-900 mt-1">৳{property.rentPrice?.toLocaleString()}/mo</p>
                      
                      <button className="popup-btn mt-2 w-full text-xs" onClick={() => window.location.href = `/properties/${property._id}`}>
                        View Details
                      </button>
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
