const { Pool } = require('pg');

const AICRM_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/aiflow";

async function inspectMessageMeta() {
  const pool = new Pool({
    connectionString: AICRM_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Inspecting "messages.meta" in "che_new" schema...');
    
    // Check first 10 messages for meta structure
    const query = `
      SELECT id, client_id, message, meta 
      FROM che_new.messages 
      WHERE meta IS NOT NULL AND meta::text <> '{}'::text
      ORDER BY id DESC
      LIMIT 10;
    `;

    const res = await pool.query(query);
    
    if (res.rows.length === 0) {
      console.log('No messages with non-empty meta found.');
    } else {
      res.rows.forEach(row => {
        console.log(`Message ID: ${row.id} (Client: ${row.client_id})`);
        console.log('Text (prefix):', row.message?.substring(0, 50));
        console.log('Meta:', JSON.stringify(row.meta, null, 2));
        console.log('-------------------');
      });
    }

  } catch (err) {
    console.error('Error during inspection:', err.message);
  } finally {
    await pool.end();
  }
}

inspectMessageMeta();
