"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UvAqiData } from "@/lib/uv-aqi-api";

const UV_SCALE = [
  { label: "Bajo",    color: "#22c55e" },
  { label: "Mod.",    color: "#eab308" },
  { label: "Alto",    color: "#f97316" },
  { label: "M.Alto",  color: "#ef4444" },
  { label: "Extremo", color: "#a855f7" },
];

const AQI_LEVELS = [
  { label: "Bueno",      color: "#22c55e" },
  { label: "Aceptable",  color: "#a3e635" },
  { label: "Moderado",   color: "#eab308" },
  { label: "Dañino",     color: "#ef4444" },
  { label: "Muy dañino", color: "#a855f7" },
];

interface CardProps {
  data: UvAqiData | null;
  loading?: boolean;
}

export function UvIndexCard({ data, loading }: CardProps) {
  const uvPercent = data ? Math.min((data.uvIndex / 12) * 100, 96) : 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Índice UV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading || !data ? (
          <>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-bold font-heading tabular-nums"
                style={{ color: data.uvColor }}
              >
                {data.uvIndex}
              </span>
              <span className="text-sm font-semibold font-heading" style={{ color: data.uvColor }}>
                {data.uvLabel}
              </span>
            </div>

            {/* Gradient scale bar with indicator dot */}
            <div className="relative">
              <div
                className="h-3 w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #22c55e 0%, #eab308 28%, #f97316 52%, #ef4444 74%, #a855f7 100%)",
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white shadow-md"
                style={{
                  left: `calc(${uvPercent}% - 8px)`,
                  backgroundColor: data.uvColor,
                }}
              />
            </div>

            <div className="flex justify-between">
              {UV_SCALE.map((s) => (
                <span
                  key={s.label}
                  className="text-[10px] font-heading font-medium"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function AqiCard({ data, loading }: CardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Calidad del aire (AQI)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading || !data ? (
          <>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-32" />
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-bold font-heading tabular-nums"
                style={{ color: data.aqiColor }}
              >
                {data.aqi}
              </span>
              <span className="text-sm font-semibold font-heading" style={{ color: data.aqiColor }}>
                {data.aqiLabel}
              </span>
            </div>

            {/* 5-segment pill bar */}
            <div className="flex gap-1.5">
              {AQI_LEVELS.map((level, i) => (
                <div
                  key={level.label}
                  className="flex-1 h-3 rounded-full transition-opacity duration-300"
                  style={{
                    backgroundColor: level.color,
                    opacity: i + 1 <= data.aqi ? 1 : 0.18,
                  }}
                />
              ))}
            </div>

            <div className="flex gap-4 text-xs text-muted-foreground font-heading">
              <span>
                PM2.5:{" "}
                <strong className="text-foreground tabular-nums">{data.pm25} µg/m³</strong>
              </span>
              <span>
                PM10:{" "}
                <strong className="text-foreground tabular-nums">{data.pm10} µg/m³</strong>
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
