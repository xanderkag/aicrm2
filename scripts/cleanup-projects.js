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
  console.log('--- Cleaning Up Projects ---');
  try {
    const keepNames = ['Кадастр бот', 'che test', 'che_new'];
    
    // First, let's see which ones we have
    const all = await pool.query('SELECT id, name FROM public.projects');
    const toDelete = all.rows.filter(p => !keepNames.includes(p.name));
    
    if (toDelete.length > 0) {
      const ids = toDelete.map(p => p.id);
      await pool.query('DELETE FROM public.projects WHERE id = ANY($1)', [ids]);
      console.log(`DELETED ${toDelete.length} projects.`);
      toDelete.forEach(p => console.log(`- Removed: ${p.name}`));
    } else {
      console.log('Nothing to delete. Only relevant projects remain.');
    }

    const remaining = await pool.query('SELECT name FROM public.projects');
    console.log('\nRemaining projects:');
    remaining.rows.forEach(p => console.log(`- ${p.name}`));

  } catch (err) {
    console.error('CLEANUP FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

run();
