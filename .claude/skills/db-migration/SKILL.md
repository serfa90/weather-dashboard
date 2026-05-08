---
name: db-migration
description: >
  Guía para agregar o modificar columnas en el schema de Drizzle ORM y sincronizar
  con Neon Postgres. Usar cuando el usuario pida agregar nuevos campos a la DB,
  cambiar tipos de columnas, o agregar nuevas tablas al proyecto.
---

# DB Migration — Weather Dashboard

## Archivos clave

- `src/lib/db/schema.ts` — definición de tablas y columnas
- `src/lib/db/queries.ts` — queries de select/insert
- `src/app/api/seed/route.ts` — datos mock para desarrollo

## Flujo estándar para agregar una columna

### 1. Editar el schema

```typescript
// src/lib/db/schema.ts
export const weatherMetrics = pgTable("weather_metrics", {
  // ... columnas existentes ...
  nuevaCampo: real("nueva_campo"),  // agregar aquí
});
```

**Tipos disponibles:**
- `real("col")` — número decimal (temperatura, UV, etc.)
- `integer("col")` — entero (humedad, AQI, etc.)
- `varchar("col", { length: N })` — string
- `.notNull()` — requerido
- `.default(valor)` — valor por defecto (IMPORTANTE para columnas nuevas en tabla existente)

### 2. Sincronizar con la DB

```bash
npx drizzle-kit push
```

> Confirmar el cambio cuando pregunte. Si la columna no tiene `.default()`,
> las filas existentes quedarán con NULL — agregar siempre un default para columnas nuevas.

### 3. Actualizar queries si hace falta

Si la nueva columna se lee o filtra, actualizar `src/lib/db/queries.ts`.

### 4. Actualizar el seed

En `src/app/api/seed/route.ts`, agregar el nuevo campo al array de records con un valor realista:

```typescript
const records = Array.from({ length: 24 }, (_, i) => ({
  // ... campos existentes ...
  nuevaCampo: Math.round(Math.random() * 10),  // valor mock
}));
```

### 5. Verificar en Drizzle Studio

```bash
npx drizzle-kit studio
```

Abre http://local.drizzle.studio para confirmar que la columna existe y tiene datos.
