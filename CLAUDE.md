# Weather Metrics Dashboard

## Proyecto

Dashboard de métricas climáticas en tiempo real para ciudades argentinas.
Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts,
Drizzle ORM, Vercel Postgres.

## Convenciones

- TypeScript strict en todos los archivos
- App Router (nunca Pages Router)
- Server Components por defecto, "use client" solo cuando sea necesario
- Imports con alias `@/` (ya configurado)
- Validación de inputs con Zod en todas las API routes
- Manejo de errores con try/catch en todo el backend

## Comandos

- `npm run dev` — desarrollo local
- `npm run build` — build de producción
- `npx drizzle-kit push` — sincronizar schema con DB
- `npx drizzle-kit studio` — UI visual de la DB
- `vercel --prod` — deploy a producción

## Estructura

- `src/app/api/` — API routes (backend)
- `src/components/dashboard/` — componentes del dashboard
- `src/components/ui/` — shadcn (NO TOCAR manualmente)
- `src/lib/db/` — schema, conexión, y queries de Drizzle
- `src/lib/` — utilidades y clientes de APIs externas
- `src/types/` — TypeScript types compartidos

## Estilo

- Tema oscuro por defecto
- Usar CSS variables de shadcn para colores
- Cards con glass morphism: `bg-card/80 backdrop-blur-sm`
- Animaciones sutiles en transiciones
