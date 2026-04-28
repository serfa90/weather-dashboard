"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherMetric } from "@/lib/db/schema";

interface MetricsGridProps {
  latest: WeatherMetric | null;
  loading?: boolean;
}

export function MetricsGrid({ latest, loading }: MetricsGridProps) {
  const metrics = latest
    ? [
        { label: "Temperatura", value: `${latest.temperature}°C`, color: "text-orange-400" },
        { label: "Sensación térmica", value: `${latest.feelsLike}°C`, color: "text-yellow-400" },
        { label: "Humedad", value: `${latest.humidity}%`, color: "text-blue-400" },
        { label: "Presión", value: `${latest.pressure} hPa`, color: "text-purple-400" },
        { label: "Viento", value: `${latest.windSpeed} m/s`, color: "text-green-400" },
        { label: "Condición", value: latest.description, color: "text-cyan-400" },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {loading || !latest
        ? Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-1">
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20" />
              </CardContent>
            </Card>
          ))
        : metrics.map((m) => (
            <Card key={m.label} className="bg-card/80 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-xl font-bold capitalize font-heading tabular-nums ${m.color}`}>{m.value}</p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
