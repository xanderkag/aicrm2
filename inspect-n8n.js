const { Pool } = require('pg');

const N8N_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/n8n";

async function inspectN8nDb() {
  const pool = new Pool({
    connectionString: N8N_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Inspecting n8n database for anything related to "chat", "message", or "unread"...');
    
    const query = `
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%chat%' OR table_name ILIKE '%message%' OR table_name ILIKE '%unread%'
      AND table_schema NOT IN ('information_schema', 'pg_catalog')
      LIMIT 20;
    `;

    const res = await pool.query(query);
    if (res.rows.length === 0) {
      console.log('No relevant tables found in n8n database.');
    } else {
      console.table(res.rows);
    }

  } catch (err) {
    console.error('Error during inspection of n8n:', err.message);
  } finally {
    await pool.end();
  }
}

inspectN8nDb();
