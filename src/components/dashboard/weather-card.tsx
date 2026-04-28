"use client";

import { WeatherData } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherCardProps {
  data: WeatherData | null;
  loading?: boolean;
}

export function WeatherCard({ data, loading }: WeatherCardProps) {
  if (loading || !data) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold font-heading">
          {data.city}, {data.country}
        </CardTitle>
        <Badge variant="secondary" className="capitalize">
          {data.description}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            width={64}
            height={64}
          />
          <div>
            <p className="text-5xl font-bold tracking-tight font-heading tabular-nums">{data.temperature}°C</p>
            <p className="text-sm text-muted-foreground font-heading tabular-nums">
              Sensación: {data.feelsLike}°C
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <MetricItem label="Humedad" value={`${data.humidity}%`} />
          <MetricItem label="Presión" value={`${data.pressure} hPa`} />
          <MetricItem label="Viento" value={`${data.windSpeed} m/s`} />
          <MetricItem label="País" value={data.country} />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-1 font-heading tabular-nums">{value}</p>
    </div>
  );
}
