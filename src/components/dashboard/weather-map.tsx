"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { useTheme } from "next-themes";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ARGENTINE_CITIES, CITY_COORDS } from "@/types/weather";
import type { WeatherMetric } from "@/lib/db/schema";

function getTempColor(temp: number): string {
  if (temp < 10) return "#3b82f6";
  if (temp < 20) return "#22c55e";
  if (temp < 30) return "#f97316";
  return "#ef4444";
}

function createMarkerIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:28px;height:36px;">
        <div style="
          width:28px;height:28px;
          background:${color};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
        "></div>
      </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

interface CityData {
  city: (typeof ARGENTINE_CITIES)[number];
  metric: WeatherMetric | null;
}

export function WeatherMap() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [cityData, setCityData] = useState<CityData[]>([]);

  useEffect(() => {
    async function fetchAllMetrics(): Promise<CityData[]> {
      const entries = await Promise.allSettled(
        ARGENTINE_CITIES.map(async (city) => {
          const res = await fetch(`/api/metrics?city=${encodeURIComponent(city)}`);
          const json = await res.json();
          const metric: WeatherMetric | null =
            json.success && json.data.length > 0 ? json.data[0] : null;
          return { city, metric } satisfies CityData;
        })
      );
      return entries
        .filter((r): r is PromiseFulfilledResult<CityData> => r.status === "fulfilled")
        .map((r) => r.value);
    }

    async function init() {
      const initial = await fetchAllMetrics();
      setCityData(initial);

      const missing = initial
        .filter(({ metric }) => !metric)
        .map(({ city }) => city);

      if (missing.length > 0) {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cities: missing }),
        });
        const updated = await fetchAllMetrics();
        setCityData(updated);
      }
    }

    init();
  }, []);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = isDark
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-heading">Mapa climático — Argentina</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-xl">
        <MapContainer
          center={[-34.6, -63.0]}
          zoom={4}
          style={{ height: "450px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer url={tileUrl} attribution={tileAttribution} />

          {cityData.map(({ city, metric }) => {
            const coords = CITY_COORDS[city];
            if (!coords) return null;

            const color = metric ? getTempColor(metric.temperature) : "#6b7280";
            const icon = createMarkerIcon(color);

            return (
              <Marker key={city} position={coords} icon={icon}>
                <Tooltip direction="top" offset={[0, -36]} opacity={1}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: 700 }}>{city}</span>
                    {metric && (
                      <span style={{ fontWeight: 700, color }}>
                        {metric.temperature}°C
                      </span>
                    )}
                  </div>
                </Tooltip>
                <Popup>
                  <div style={{ fontFamily: "var(--font-heading)", minWidth: "140px" }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{city}</p>
                    {metric ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <img
                            src={`https://openweathermap.org/img/wn/${metric.icon}.png`}
                            alt={metric.description}
                            width={32}
                            height={32}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: "22px", fontWeight: 700, color }}>{metric.temperature}°C</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize", marginBottom: "2px" }}>
                          {metric.description}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>
                          Humedad: <strong>{metric.humidity}%</strong>
                        </p>
                      </>
                    ) : (
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>Sin datos</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
