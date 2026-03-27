---
name: nextjs-dashboard-setup
description: >
  Inicializa un proyecto Next.js 15 con App Router, TypeScript, Tailwind CSS 4,
  shadcn/ui, Drizzle ORM, y Vercel Postgres para un dashboard de métricas.
  Usa esta skill cuando el usuario pida crear el proyecto desde cero,
  configurar el entorno inicial, o hacer setup del boilerplate.
---

# Next.js Dashboard Setup

Cuando configures el proyecto, seguí estos pasos exactos:

## 1. Crear el proyecto

```bash
npx create-next-app@latest weather-dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd weather-dashboard
```

## 2. Instalar dependencias

```bash
# UI Components
npx shadcn@latest init
npx shadcn@latest add card button badge separator skeleton tabs

# Charts
npm install recharts

# Database
npm install drizzle-orm @vercel/postgres
npm install -D drizzle-kit

# Utilities
npm install date-fns zod
```

## 3. Estructura de carpetas

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx # Dashboard principal
│ ├── api/
│ │ ├── weather/
│ │ │ └── route.ts # GET /api/weather?city=Buenos+Aires
│ │ ├── metrics/
│ │ │ └── route.ts # GET /api/metrics (histórico desde DB)
│ │ └── sync/
│ │ └── route.ts # POST /api/sync (guardar datos en DB)
│ └── globals.css
├── components/
│ ├── dashboard/
│ │ ├── weather-card.tsx
│ │ ├── temperature-chart.tsx
│ │ ├── humidity-chart.tsx
│ │ ├── city-selector.tsx
│ │ └── metrics-grid.tsx
│ └── ui/ # shadcn components (auto-generated)
├── lib/
│ ├── db/
│ │ ├── schema.ts # Drizzle schema
│ │ ├── index.ts # DB connection
│ │ └── queries.ts # Query helpers
│ ├── weather-api.ts # OpenWeatherMap client
│ └── utils.ts
└── types/
└── weather.ts # TypeScript types

## 4. Variables de entorno (.env.local)

OPENWEATHER_API_KEY=tu_api_key_aqui
POSTGRES_URL=tu_vercel_postgres_url

## 5. Configuración de Drizzle (drizzle.config.ts)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Siempre usar App Router (nunca Pages Router). Siempre TypeScript strict.
