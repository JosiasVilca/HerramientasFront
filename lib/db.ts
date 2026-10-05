import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:5ab710fa849a4898784b5b5affba2504@26kgknrj.us-east.database.insforge.app:5432/insforge?sslmode=require";

// Global pool instance for Next.js hot reloading in development
const globalForDb = globalThis as unknown as {
  connPool: Pool | undefined;
};

export const db =
  globalForDb.connPool ??
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connPool = db;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("Executed query", { text, duration, rows: res.rowCount });
    }
    return res.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}
