import { db } from "./index";
import { weatherMetrics } from "./schema";
import { desc, eq, gte, and } from "drizzle-orm";

export async function getRecentMetrics(city: string, limit = 24) {
  return db
    .select()
    .from(weatherMetrics)
    .where(eq(weatherMetrics.city, city))
    .orderBy(desc(weatherMetrics.recordedAt))
    .limit(limit);
}

export async function getMetricsSince(city: string, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return db
    .select()
    .from(weatherMetrics)
    .where(and(eq(weatherMetrics.city, city), gte(weatherMetrics.recordedAt, since)))
    .orderBy(desc(weatherMetrics.recordedAt))
    .limit(48);
}

export async function insertMetric(data: typeof weatherMetrics.$inferInsert) {
  const rows = await db.insert(weatherMetrics).values(data).returning();
  return rows[0];
}
