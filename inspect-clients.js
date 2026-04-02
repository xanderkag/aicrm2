const { Pool } = require('pg');

const AICRM_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/aiflow";

async function inspectClientColumnsDetailed() {
  const pool = new Pool({
    connectionString: AICRM_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Detailed inspection of "clients" table columns in "che_new" schema...');
    
    // List all columns to find anything related to 'read', 'seen', 'count'
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clients' AND table_schema = 'che_new'
      AND (column_name ILIKE '%read%' OR column_name ILIKE '%seen%' OR column_name ILIKE '%count%' OR column_name ILIKE '%view%');
    `;

    const res = await pool.query(query);
    if (res.rows.length === 0) {
      console.log('No relevant columns found in information_schema. Checking all columns just in case...');
      const allCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'clients' AND table_schema = 'che_new'`);
      console.table(allCols.rows);
    } else {
      console.table(res.rows);
    }

  } catch (err) {
    console.error('Error during inspection:', err.message);
  } finally {
    await pool.end();
  }
}

inspectClientColumnsDetailed();
