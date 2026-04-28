"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { ARGENTINE_CITIES, ArgenteCity, WeatherData } from "@/types/weather";
import type { WeatherMetric } from "@/lib/db/schema";

const CitySelector = dynamic(
  () => import("@/components/dashboard/city-selector").then((m) => m.CitySelector),
  { ssr: false }
);
const TemperatureChart = dynamic(
  () => import("@/components/dashboard/temperature-chart").then((m) => m.TemperatureChart),
  { ssr: false }
);
const HumidityChart = dynamic(
  () => import("@/components/dashboard/humidity-chart").then((m) => m.HumidityChart),
  { ssr: false }
);
const WeatherMap = dynamic(
  () => import("@/components/dashboard/weather-map").then((m) => m.WeatherMap),
  { ssr: false }
);

export default function DashboardPage() {
  const [city, setCity] = useState<ArgenteCity>(ARGENTINE_CITIES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [metrics, setMetrics] = useState<WeatherMetric[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadWeather = useCallback(async (c: string) => {
    setLoadingWeather(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(c)}`);
      const json = await res.json();
      if (json.success) setWeather(json.data);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const loadMetrics = useCallback(async (c: string) => {
    setLoadingMetrics(true);
    try {
      const res = await fetch(`/api/metrics?city=${encodeURIComponent(c)}`);
      const json = await res.json();
      if (json.success) setMetrics(json.data);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  const sync = useCallback(async (c: string) => {
    setSyncing(true);
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cities: [c] }),
      });
      await loadMetrics(c);
    } finally {
      setSyncing(false);
    }
  }, [loadMetrics]);

  useEffect(() => {
    loadWeather(city);
    loadMetrics(city).then(async () => {
      // Auto-sync si no hay datos históricos
      const res = await fetch(`/api/metrics?city=${encodeURIComponent(city)}`);
      const json = await res.json();
      if (json.success && json.data.length === 0) {
        await sync(city);
      }
    });
  }, [city, loadWeather, loadMetrics, sync]);

  const latest = metrics[0] ?? null;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard Climático</h1>
            <p className="text-muted-foreground mt-1">Métricas en tiempo real — ciudades argentinas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sync(city)}
              disabled={syncing}
            >
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <CitySelector selected={city} onChange={setCity} />

        <WeatherCard data={weather} loading={loadingWeather} />

        <MetricsGrid latest={latest} loading={loadingMetrics || syncing} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TemperatureChart data={metrics} />
          <HumidityChart data={metrics} />
        </div>

        <WeatherMap />
      </div>
    </main>
  );
}
