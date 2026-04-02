import { Pool } from 'pg';

// Standard PostgreSQL connection pool configuration
// Vercel Serverless optimization: Reuse the pool across invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: false, // The Hetzner database server does not support SSL connections
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Slightly increased for remote connection stability
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Helper for dynamic schema mapping
export const asSchema = (schema: string | null | undefined, table: string) => {
  const safeSchema = schema && /^[a-zA-Z0-9_]+$/.test(schema) ? schema : 'public';
  return `"${safeSchema}"."${table}"`;
};

export default pool;
