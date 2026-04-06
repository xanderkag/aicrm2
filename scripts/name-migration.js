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
  console.log('--- Client Name Migration ---');
  try {
    const projects = await pool.query('SELECT schema_name FROM public.projects');
    console.log(`Found ${projects.rows.length} projects to update.`);
    
    for (const p of projects.rows) {
      if (!p.schema_name) continue;
      
      console.log(`Updating schema: ${p.schema_name}...`);
      try {
        // Add name column to clients table
        await pool.query(`ALTER TABLE "${p.schema_name}"."clients" ADD COLUMN IF NOT EXISTS name TEXT`);
        console.log(`- SUCCESS: ${p.schema_name}.clients updated.`);
      } catch (err) {
        if (err.message.includes('relation') && err.message.includes('does not exist')) {
          console.warn(`- WARNING: Table "clients" not found in schema "${p.schema_name}", skipping.`);
        } else {
          console.error(`- FAILED: ${p.schema_name}: ${err.message}`);
        }
      }
    }

    console.log('\nSUCCESS: Database migration for Client Names completed.');
  } catch (err) {
    console.error('CRITICAL MIGRATION FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

run();
