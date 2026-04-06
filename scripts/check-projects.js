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
  console.log('--- Full Projects Inspection ---');
  try {
    const res = await pool.query("SELECT * FROM public.projects LIMIT 3");
    if (res.rows.length > 0) {
      console.log('Columns in public.projects:');
      Object.keys(res.rows[0]).forEach(key => console.log(`- ${key}`));
      
      console.log('\nProject Data (Sample):');
      console.log(JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log('No projects found to inspect.');
    }

  } catch (err) {
    console.error('FAILED to inspect projects:', err.message);
  } finally {
    await pool.end();
  }
}

run();
