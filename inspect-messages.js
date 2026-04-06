const { Pool } = require('pg');

const AICRM_DATABASE_URL = "postgresql://postgres:n8nChePassword@95.216.43.235:13432/aiflow";

async function inspectRecentVoiceMessages() {
  const pool = new Pool({
    connectionString: AICRM_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Inspecting last 20 messages in "che_new" for voice/audio indicators...');
    
    const query = `
      SELECT id, client_id, message, meta, created_at 
      FROM che_new.messages 
      ORDER BY created_at DESC
      LIMIT 20;
    `;

    const res = await pool.query(query);
    
    if (res.rows.length === 0) {
      console.log('No messages found.');
    } else {
      res.rows.forEach(row => {
        const isVoice = JSON.stringify(row.meta).toLowerCase().includes('voice') || 
                        JSON.stringify(row.meta).toLowerCase().includes('audio') ||
                        JSON.stringify(row.message).toLowerCase().includes('voice') ||
                        JSON.stringify(row.message).toLowerCase().includes('audio');
        
        console.log(`[${row.created_at}] ID: ${row.id} ${isVoice ? '🔊 VOICE DETECTED' : ''}`);
        console.log('Text:', row.message?.substring(0, 100));
        console.log('Meta:', JSON.stringify(row.meta));
        console.log('-------------------');
      });
    }

  } catch (err) {
    console.error('Error during inspection:', err.message);
  } finally {
    await pool.end();
  }
}

inspectRecentVoiceMessages();
