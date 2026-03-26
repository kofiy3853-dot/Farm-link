'use client';


import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const truckIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Small truck icon
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});

interface DeliveryMapProps {
    pickupCoords?: [number, number];
    dropoffCoords?: [number, number];
    currentLocation?: [number, number];
    zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function DeliveryMap({
    pickupCoords = [5.6037, -0.1870], // Default Accra
    dropoffCoords,
    currentLocation,
    zoom = 13
}: DeliveryMapProps) {

    // Auto-center on current location if available, otherwise pickup
    const center: [number, number] = currentLocation || pickupCoords;

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickupCoords && (
                <Marker position={pickupCoords} icon={defaultIcon}>
                    <Popup>Pickup Point</Popup>
                </Marker>
            )}

            {dropoffCoords && (
                <Marker position={dropoffCoords} icon={defaultIcon}>
                    <Popup>Dropoff Point</Popup>
                </Marker>
            )}

            {currentLocation && (
                <Marker position={currentLocation} icon={truckIcon}>
                    <Popup>Driver Current Location</Popup>
                </Marker>
            )}

            <ChangeView center={center} zoom={zoom} />
        </MapContainer>
    );
}
