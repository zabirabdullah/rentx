import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// A component to handle map clicks and updating the marker position
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationSelect) {
        onLocationSelect({ lat: newPos[0], lng: newPos[1] });
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationPickerMap = ({ initialLocation, onLocationSelect }) => {
  // Default to Chittagong, Bangladesh if no initial location
  const defaultCenter = [22.3569, 91.7832]; 
  const [position, setPosition] = useState(
    initialLocation && initialLocation.lat && initialLocation.lng 
      ? [initialLocation.lat, initialLocation.lng] 
      : null
  );

  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setPosition([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  return (
    <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <MapContainer 
        center={position || defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
