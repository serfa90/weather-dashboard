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

const HUMIDITY_COLOR = "#3b82f6";

interface HumidityChartProps {
  data: WeatherMetric[];
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartData = [...data].reverse().map((m) => ({
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
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={HUMIDITY_COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={HUMIDITY_COLOR} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="time"
              interval={3}
              tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fontFamily: "var(--font-heading)", fill: "var(--muted-foreground)" }}
              unit="%"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--foreground)", marginBottom: "4px" }}
              itemStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="humedad"
              stroke={HUMIDITY_COLOR}
              strokeWidth={2.5}
              fill="url(#humidityGradient)"
              dot={false}
              activeDot={{ r: 4, fill: HUMIDITY_COLOR, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
