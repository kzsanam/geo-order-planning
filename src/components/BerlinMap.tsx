import React, { useMemo, useCallback } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TeamWithOrders } from "../models/Models";

type BerlinMapProps = {
    teams: TeamWithOrders[];
};

const isValidCoordinate = (lat: string, lon: string): boolean => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    return !isNaN(latNum) && !isNaN(lonNum);
};

const teamColors = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#16a085", "#f1c40f"];

// Build a Leaflet icon from an inline SVG so we don’t depend on external URLs.
function makeSvgIcon(color: string): L.Icon {
    const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32C32 7.2 24.8 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6" fill="#ffffff"/>
    </svg>
  `);

    return L.icon({
        iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -44],
    });
}

const BerlinMap: React.FC<BerlinMapProps> = ({ teams }) => {
    // Cache icons per color (prevents re-instantiation on every render)
    const iconCache = useMemo(() => new Map<string, L.Icon>(), []);
    const getIcon = useCallback((color: string) => {
        let icon = iconCache.get(color);
        if (!icon) {
            icon = makeSvgIcon(color);
            iconCache.set(color, icon);
        }
        return icon;
    }, [iconCache]);

    // Flatten orders but keep team name & color
    const allOrders = useMemo(() => {
        return teams.flatMap((team, i) =>
            team.orders.map(o => ({
                ...o,
                teamName: team.name,
                color: teamColors[i % teamColors.length],
            }))
        );
    }, [teams]);

    const validOrders = allOrders.filter(o => isValidCoordinate(o.lat, o.lon));

    return (
        <MapContainer
            center={[52.52, 13.405]}
            zoom={12}
            scrollWheelZoom
            style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {validOrders.map((o, idx) => (
                <Marker
                    key={`${o.teamName}-${idx}`}
                    position={[parseFloat(o.lat), parseFloat(o.lon)]}
                    icon={getIcon(o.color)}
                >
                    <Popup>
                        <b>{o.teamName}</b>
                        <br />
                        {o.fullAddress || `Point ${idx + 1}`}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default BerlinMap;
