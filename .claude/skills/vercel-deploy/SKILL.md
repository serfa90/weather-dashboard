---
name: vercel-deploy
description: >
  Configuración y deploy a Vercel con Vercel Postgres.
  Usa esta skill cuando el usuario pida deployar, configurar Vercel,
  setear environment variables, o preparar el proyecto para producción.
---

# Vercel Deploy

## Pre-requisitos

1. Cuenta en Vercel (gratis con GitHub)
2. Proyecto pusheado a GitHub

## Setup de Vercel Postgres

```bash
# Instalar Vercel CLI
npm i -g vercel

# Linkear proyecto
vercel link

# Crear base de datos Postgres
vercel storage create postgres weather-db

# Esto automáticamente agrega las env vars al proyecto en Vercel
# Para desarrollo local:
vercel env pull .env.local
```

## Configuración de next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar Server Actions
  experimental: {},
  // Optimización de imágenes si usás iconos del clima
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
};

export default nextConfig;
```

## Deploy

```bash
# Push a GitHub (Vercel auto-deploya)
git add .
git commit -m "ready to deploy"
git push origin main

# O deploy manual
vercel --prod
```

## Checklist pre-deploy:

- [ ] `.env.local` NO está en git (verificar .gitignore)
- [ ] Environment variables seteadas en Vercel Dashboard
- [ ] `npm run build` funciona sin errores
- [ ] Database schema migrado con `npx drizzle-kit push`
- [ ] API de OpenWeatherMap funciona (testear endpoint /api/weather)
