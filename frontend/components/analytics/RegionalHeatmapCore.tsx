'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Approximate coordinates for Ghanaian regions for the heatmap
const REGION_COORDS: Record<string, [number, number]> = {
    'Greater Accra': [5.6037, -0.1870],
    'Ashanti Region': [6.6666, -1.6163],
    'Northern Region': [9.4008, -0.8393],
    'Western Region': [5.5000, -2.0000],
    'Eastern Region': [6.0000, -0.5000],
    'Volta Region': [6.3333, 0.4500],
    'Bono Region': [7.5833, -2.3333],
    'Brong Ahafo Region': [7.3333, -1.5000],
};

interface HeatmapData {
    region: string;
    supplyVolume: number;
    alertLevel: string;
}

export default function RegionalHeatmapCore({ heatmapData }: { heatmapData: HeatmapData[] }) {
    // Default center to Ghana
    const center: [number, number] = [7.9465, -1.0232];

    return (
        <MapContainer center={center} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            {/* Darker tile layer for a more "dashboard/analytics" feel */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {heatmapData.map((data, idx) => {
                const coords = REGION_COORDS[data.region];
                if (!coords) return null;

                // Scale the radius so regions with huge supply have larger circles
                const radius = Math.max(15, Math.min(50, data.supplyVolume / 20));

                // Color changes based on the alert level (low supply = red alert, healthy = green/blue)
                const color = data.alertLevel === 'LOW_SUPPLY_WARNING' ? '#ef4444' : '#3b82f6';
                const fillColor = data.alertLevel === 'LOW_SUPPLY_WARNING' ? '#f87171' : '#60a5fa';

                return (
                    <CircleMarker
                        key={idx}
                        center={coords}
                        pathOptions={{ color, fillColor, fillOpacity: 0.6, weight: 2 }}
                        radius={radius}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="font-sans text-sm p-1">
                                <b className="text-slate-900 block mb-1">{data.region} Region</b>
                                Available Supply: <span className="font-bold">{data.supplyVolume} MT</span><br />
                                Status: <span className={data.alertLevel === 'LOW_SUPPLY_WARNING' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{data.alertLevel.replace(/_/g, ' ')}</span>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
}
