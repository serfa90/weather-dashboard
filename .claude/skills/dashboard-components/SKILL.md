---
name: dashboard-components
description: >
  Patrones de componentes React para dashboards con Recharts, shadcn/ui y
  Tailwind CSS. Usa esta skill cuando el usuario pida crear componentes visuales,
  gráficos, cards de métricas, o cualquier elemento de UI del dashboard.
  También cuando pida mejorar el diseño o agregar animaciones.
---

# Dashboard Components

## Principios de diseño

- Tema oscuro por defecto (más profesional para dashboards)
- Esquema de colores: slate para backgrounds, sky/cyan para acentos
- Fuente: Geist Sans (viene con Next.js)
- Bordes sutiles con `border-border/50`
- Glass morphism sutil en cards: `bg-card/80 backdrop-blur-sm`

## Card de métrica (patrón base)

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        {trend && (
          <Badge
            variant={trend === "up" ? "destructive" : "secondary"}
            className="mt-2"
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} vs última hora
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

## Chart de temperatura (patrón para Recharts)

```tsx
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

interface TemperatureChartProps {
  data: Array<{ time: string; temp: number; feelsLike: number }>;
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Temperatura (últimas 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="hsl(var(--chart-1))"
              fill="url(#tempGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## Reglas de componentes:

- SIEMPRE usar "use client" en componentes con interactividad o hooks
- SIEMPRE usar ResponsiveContainer de Recharts (nunca ancho fijo)
- SIEMPRE usar CSS variables de shadcn para colores en charts
- Componentes del dashboard van en `src/components/dashboard/`
- Componentes de shadcn van en `src/components/ui/` (no tocar)
- SIEMPRE agregar loading skeletons para datos async
