const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Basic env parser since we want to be safe with node versions
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function run() {
  console.log('--- Database Migration: Auth System ---');
  console.log('Connecting to database...');
  
  try {
    // We use "IF NOT EXISTS" so it is safe to run multiple times
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('SUCCESS: public.users table is ready.');
    
    // Check if table exists
    const res = await pool.query("SELECT count(*) FROM public.users");
    console.log(`Current user count: ${res.rows[0].count}`);

  } catch (err) {
    console.error('MIGRATION FAILED:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
