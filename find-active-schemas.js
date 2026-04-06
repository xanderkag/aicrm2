const { Pool } = require('pg');

const AICRM_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/aiflow";

async function findActiveSchemas() {
  const pool = new Pool({
    connectionString: AICRM_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Searching for "messages" tables across all schemas...');
    
    const query = `
      SELECT table_schema 
      FROM information_schema.tables 
      WHERE table_name = 'messages' 
      AND table_schema NOT IN ('information_schema', 'pg_catalog', 'public');
    `;

    const schemasRes = await pool.query(query);
    const schemas = schemasRes.rows.map(r => r.table_schema);
    
    console.log(`Found ${schemas.length} schemas with "messages" table.`);

    for (const schema of schemas) {
      const lastMsgQuery = `SELECT created_at FROM ${schema}.messages ORDER BY created_at DESC LIMIT 1`;
      try {
        const lastMsgRes = await pool.query(lastMsgQuery);
        if (lastMsgRes.rows.length > 0) {
          console.log(`Schema: ${schema} | Last message: ${lastMsgRes.rows[0].created_at}`);
        } else {
          console.log(`Schema: ${schema} | Empty`);
        }
      } catch (err) {
        console.error(`Error querying schema ${schema}:`, err.message);
      }
    }

  } catch (err) {
    console.error('Error during global inspection:', err.message);
  } finally {
    await pool.end();
  }
}

findActiveSchemas();
