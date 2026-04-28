"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { WeatherMetric } from "@/lib/db/schema";

interface TemperatureChartProps {
  data: WeatherMetric[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = [...data]
    .reverse()
    .map((m) => ({
      time: format(new Date(m.recordedAt), "HH:mm", { locale: es }),
      temperatura: m.temperature,
      sensacion: m.feelsLike,
    }));

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-heading">Temperatura (últimas 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "hsl(var(--muted-foreground))" }} unit="°" />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
              labelStyle={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-heading)" }}
              itemStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sensacion"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
