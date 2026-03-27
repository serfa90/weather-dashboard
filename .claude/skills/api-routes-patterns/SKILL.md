---
name: api-routes-patterns
description: >
  Patrones para crear API routes en Next.js App Router con validación Zod,
  manejo de errores, y conexión a Vercel Postgres via Drizzle ORM.
  Usa esta skill siempre que el usuario pida crear endpoints, rutas API,
  Server Actions, o cualquier lógica de backend en el proyecto.
---

# API Routes Patterns

## Patrón estándar para API routes

Todas las API routes deben seguir este patrón:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 1. Schema de validación
const querySchema = z.object({
  city: z.string().min(1),
});

// 2. Handler con try/catch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      city: searchParams.get("city"),
    });

    // 3. Lógica de negocio
    const data = await fetchWeatherData(params.city);

    // 4. Response tipada
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Reglas estrictas:

- SIEMPRE validar inputs con Zod
- SIEMPRE wrappear en try/catch
- SIEMPRE retornar `{ success: boolean, data?: T, error?: string }`
- NUNCA exponer API keys del servidor al cliente
- SIEMPRE usar `NextRequest` y `NextResponse` (no `Request`/`Response` nativos)

## Schema de base de datos (Drizzle)

```typescript
import {
  pgTable,
  serial,
  varchar,
  real,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const weatherMetrics = pgTable("weather_metrics", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 10 }).notNull(),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like").notNull(),
  humidity: integer("humidity").notNull(),
  windSpeed: real("wind_speed").notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});
```

## Queries helper pattern

```typescript
import { db } from "./index";
import { weatherMetrics } from "./schema";
import { desc, eq } from "drizzle-orm";

export async function getRecentMetrics(city: string, limit = 24) {
  return db
    .select()
    .from(weatherMetrics)
    .where(eq(weatherMetrics.city, city))
    .orderBy(desc(weatherMetrics.recordedAt))
    .limit(limit);
}

export async function insertMetric(data: typeof weatherMetrics.$inferInsert) {
  return db.insert(weatherMetrics).values(data).returning();
}
```
