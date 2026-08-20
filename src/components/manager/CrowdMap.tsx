"use client"
import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CrowdSite } from "./useManagementState";

export default function CrowdMap({ 
  crowdSites, 
  selectedId, 
  onSelect,
  color
}: { 
  crowdSites: CrowdSite[];
  selectedId: string;
  onSelect: (s: CrowdSite) => void;
  color: (l: string) => string;
}) {
  return (
    <MapContainer center={[27.6737, 85.3245]} zoom={16} className="mc-leaflet">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {crowdSites.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={s.id === selectedId ? 13 : 10}
          eventHandlers={{ click: () => onSelect(s) }}
          pathOptions={{
            color: "#fff",
            fillColor: color(s.level),
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>{s.name} · {s.level}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
