import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | undefined;

function getDb(): Db {
  if (!_db) {
    _db = drizzle(neon(process.env.POSTGRES_URL!), { schema });
  }
  return _db;
}

// Proxy so neon() is only called at first query, not at module import time.
// This prevents build failures when POSTGRES_URL is not available at build time.
export const db = new Proxy({} as Db, {
  get(_, prop: string | symbol) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
