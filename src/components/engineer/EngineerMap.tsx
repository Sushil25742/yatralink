"use client"
import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { EngineerNode, EngineerRoute, nodeColors } from "./types";

function MapClick({ enabled, onPoint }: { enabled: boolean; onPoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (enabled) onPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function EngineerMap({
  addMode,
  addPoint,
  routeLines,
  nodes,
  selected,
  toggleSelect,
  removeNode
}: {
  addMode: boolean;
  addPoint: (lat: number, lng: number) => void;
  routeLines: { route: EngineerRoute; points: EngineerNode[] }[];
  nodes: EngineerNode[];
  selected: string[];
  toggleSelect: (id: string) => void;
  removeNode: (id: string) => void;
}) {
  return (
    <MapContainer center={[27.6737, 85.3245]} zoom={16} className="engineer-map">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClick enabled={addMode} onPoint={addPoint} />
      {routeLines.map(({ route, points }) => (
        <Polyline
          key={route.id}
          positions={points.map((p) => [p.lat, p.lng] as [number, number])}
          pathOptions={{
            color: route.published ? "#0c716f" : "#64748b",
            weight: 5,
            dashArray: route.published ? undefined : "8 8",
          }}
        />
      ))}
      {nodes.map((n) => (
        <CircleMarker
          key={n.id}
          center={[n.lat, n.lng]}
          radius={selected.includes(n.id) ? 12 : 9}
          eventHandlers={{ click: () => toggleSelect(n.id) }}
          pathOptions={{
            color: "#fff",
            fillColor: nodeColors[n.type] || "#0c716f",
            fillOpacity: 1,
            weight: selected.includes(n.id) ? 4 : 2,
          }}
        >
          <Popup>
            <strong>{n.name}</strong>
            <br />
            {n.type}
            <br />
            <button className="popup-delete" onClick={() => removeNode(n.id)}>
              Delete point
            </button>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
