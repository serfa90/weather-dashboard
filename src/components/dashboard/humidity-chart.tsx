"use client";

import {
  AreaChart,
  Area,
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

interface HumidityChartProps {
  data: WeatherMetric[];
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartData = [...data]
    .reverse()
    .map((m) => ({
      time: format(new Date(m.recordedAt), "HH:mm", { locale: es }),
      humedad: m.humidity,
    }));

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-heading">Humedad (últimas 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "hsl(var(--muted-foreground))" }} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
              labelStyle={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-heading)" }}
              itemStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="humedad"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#humidityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
