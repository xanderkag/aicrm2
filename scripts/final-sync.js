require('dotenv').config();
const { Client } = require('pg');

async function sync() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL + '?sslmode=require',
  });
  await client.connect();
  console.log('--- Database Sync Started ---');

  // Fetch all relevant schemas
  const schemasResult = await client.query(`
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name LIKE 'project_%' 
    OR schema_name IN ('che_new', 'che_test', 'project_1769877251945')
  `);

  for (let row of schemasResult.rows) {
    const schema = row.schema_name;
    try {
      console.log(`Syncing schema: ${schema}`);
      await client.query(`
        ALTER TABLE ${schema}.clients 
        ADD COLUMN IF NOT EXISTS name TEXT,
        ADD COLUMN IF NOT EXISTS is_ai_enabled BOOLEAN DEFAULT TRUE;
      `);
      console.log(`- Success: ${schema}.clients updated.`);
    } catch (err) {
      console.error(`- Error in ${schema}:`, err.message);
    }
  }

  await client.end();
  console.log('--- Database Sync Completed ---');
}

sync().catch(console.error);
