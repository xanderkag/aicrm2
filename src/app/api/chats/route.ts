import { NextRequest, NextResponse } from 'next/server';
import { query, asSchema } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schema = searchParams.get('schema');

    // Standard query for fetching clients and their most recent message
    // Matches the "CLIENT REG" and "INSERT_CLIENT_MSG" nodes from n8n main.json
    const result = await query(`
      SELECT 
        c.id, 
        c.messenger_user_id, 
        c.messenger, 
        m.message as last_message, 
        m.created_at as last_message_time,
        c.meta
      FROM ${asSchema(schema, 'clients')} c
      LEFT JOIN (
        SELECT DISTINCT ON (client_id) client_id, message, created_at
        FROM ${asSchema(schema, 'messages')}
        ORDER BY client_id, created_at DESC
      ) m ON c.id = m.client_id
      ORDER BY m.created_at DESC NULLS LAST
      LIMIT 50;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
