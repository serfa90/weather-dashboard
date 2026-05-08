"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { WeatherMetric } from "@/lib/db/schema";

const TEMP_COLOR = "#f97316";
const FEELS_COLOR = "#94a3b8";

interface TemperatureChartProps {
  data: WeatherMetric[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = [...data].reverse().map((m) => ({
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
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TEMP_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={TEMP_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={FEELS_COLOR} stopOpacity={0.15} />
                <stop offset="95%" stopColor={FEELS_COLOR} stopOpacity={0} />
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
              unit="°"
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
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(val) => (
                <span style={{ fontSize: 11, fontFamily: "var(--font-heading)", color: "var(--muted-foreground)" }}>
                  {val === "temperatura" ? "Temperatura" : "Sensación"}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="temperatura"
              stroke={TEMP_COLOR}
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 4, fill: TEMP_COLOR, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="sensacion"
              stroke={FEELS_COLOR}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="url(#feelsGradient)"
              dot={false}
              activeDot={{ r: 3, fill: FEELS_COLOR, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
