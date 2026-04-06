const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[match[1]] = value;
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
  console.log('--- Database Repair: Adding missing columns ---');
  try {
    // Add columns one by one if they don't exist
    const columnsToAdd = [
      { name: 'name', type: 'TEXT' },
      { name: 'password', type: 'TEXT' },
      { name: 'image', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of columnsToAdd) {
      try {
        await pool.query(`ALTER TABLE public.users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        if (err.code === '42701') {
          console.log(`Column ${col.name} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    console.log('SUCCESS: Table public.users repaired.');
  } catch (err) {
    console.error('REPAIR FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

run();
