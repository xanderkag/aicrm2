require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Successfully connected to database:', res.rows[0].now);
    await pool.end();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

testConnection();
