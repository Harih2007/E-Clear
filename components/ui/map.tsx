"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { useEffect } from "react"

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const greenIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const blueIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    userLocation?: { lat: number; lng: number };
    eCentres?: Array<{
        name: string;
        distance: string;
        coordinates: { lat: number; lng: number };
    }>;
}

// Component to update map center when location changes
function ChangeMapView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (map && center && center[0] && center[1]) {
            try {
                map.setView(center, 13, { animate: true });
            } catch (error) {
                console.error('Error updating map view:', error);
            }
        }
    }, [center, map]);
    return null;
}

export default function Map({ userLocation, eCentres }: MapProps) {
    // Default center (Delhi, India)
    const defaultCenter: [number, number] = [28.6139, 77.2090];
    
    // Only use user location if both lat and lng are valid numbers
    const center: [number, number] = (userLocation && 
                                      typeof userLocation.lat === 'number' && 
                                      typeof userLocation.lng === 'number' &&
                                      !isNaN(userLocation.lat) &&
                                      !isNaN(userLocation.lng))
        ? [userLocation.lat, userLocation.lng] 
        : defaultCenter;

    // Create a unique key for the map to force remount on significant location changes
    const mapKey = `${center[0].toFixed(2)}-${center[1].toFixed(2)}`;

    return (
        <MapContainer 
            key={mapKey}
            center={center} 
            zoom={13} 
            scrollWheelZoom={false} 
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Location Marker (Blue) */}
            {userLocation && 
             typeof userLocation.lat === 'number' && 
             typeof userLocation.lng === 'number' &&
             !isNaN(userLocation.lat) &&
             !isNaN(userLocation.lng) && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
                    <Popup>
                        <strong>📍 Your Location</strong>
                    </Popup>
                </Marker>
            )}

            {/* E-Centre Markers */}
            {eCentres && eCentres.map((centre, idx) => (
                <Marker 
                    key={idx} 
                    position={[centre.coordinates.lat, centre.coordinates.lng]} 
                    icon={greenIcon}
                >
                    <Popup>
                        <strong>{centre.name}</strong><br />
                        Distance: {centre.distance}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
