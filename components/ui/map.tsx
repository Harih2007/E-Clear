"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
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

export default function Map() {
    return (
        <MapContainer center={[37.7749, -122.4194]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[37.7749, -122.4194]} icon={icon}>
                <Popup>
                    A sample Drop-off Point. <br /> certified e-waste collection.
                </Popup>
            </Marker>
            <Marker position={[37.7849, -122.4094]} icon={icon}>
                <Popup>
                    Another Collection Center.
                </Popup>
            </Marker>
        </MapContainer>
    )
}
