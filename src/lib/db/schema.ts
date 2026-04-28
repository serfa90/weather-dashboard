import { pgTable, serial, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";

export const weatherMetrics = pgTable("weather_metrics", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 10 }).notNull().default("AR"),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like").notNull(),
  humidity: integer("humidity").notNull(),
  pressure: integer("pressure").notNull(),
  windSpeed: real("wind_speed").notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
});

export type WeatherMetric = typeof weatherMetrics.$inferSelect;
export type NewWeatherMetric = typeof weatherMetrics.$inferInsert;
