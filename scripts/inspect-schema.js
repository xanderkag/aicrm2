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
  console.log('--- Inspecting Project Schema: che_new ---');
  try {
    // List tables in the schema
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'che_new'");
    console.log('Tables found:');
    tables.rows.forEach(t => console.log(`- ${t.table_name}`));
    
    // Check columns of 'clients' or 'chats' table
    const targetTable = tables.rows.find(t => t.table_name === 'clients' || t.table_name === 'chats')?.table_name;
    if (targetTable) {
       console.log(`\nColumns in ${targetTable}:`);
       const cols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'che_new' AND table_name = '${targetTable}'`);
       cols.rows.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));
    }

  } catch (err) {
    console.error('FAILED to inspect schema:', err.message);
  } finally {
    await pool.end();
  }
}

run();
