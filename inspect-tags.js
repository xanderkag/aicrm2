const { Pool } = require('pg');

const AICRM_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/aiflow";

async function inspectClientMeta() {
  const pool = new Pool({
    connectionString: AICRM_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Inspecting "meta" column in "che_new.clients" for tags...');
    
    // Check first 5 clients to see meta structure
    const query = `
      SELECT id, messenger_user_id, meta 
      FROM che_new.clients 
      WHERE meta IS NOT NULL AND meta::text <> '{}'::text
      LIMIT 10;
    `;

    const res = await pool.query(query);
    
    if (res.rows.length === 0) {
      console.log('No clients with non-empty meta found in "che_new".');
    } else {
      res.rows.forEach(row => {
        console.log(`Client ID: ${row.id} (${row.messenger_user_id})`);
        console.log('Meta:', JSON.stringify(row.meta, null, 2));
        console.log('-------------------');
      });
    }

    // Also check "che_test" just in case
    console.log('\nInspecting "meta" in "che_test.clients"...');
    const resTest = await pool.query(`SELECT id, meta FROM che_test.clients WHERE meta IS NOT NULL LIMIT 5;`);
    resTest.rows.forEach(row => {
      console.log(`Client ID: ${row.id}`);
      console.log('Meta:', JSON.stringify(row.meta, null, 2));
    });

  } catch (err) {
    console.error('Error during inspection:', err.message);
  } finally {
    await pool.end();
  }
}

inspectClientMeta();
