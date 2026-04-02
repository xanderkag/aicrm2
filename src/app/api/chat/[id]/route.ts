import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch full message history for a specific client
    // Includes meta for sender identification (request=User, response=AI/Admin)
    const result = await query(`
      SELECT 
        m.id,
        m.message as text,
        m.meta->>'type' as type,
        m.meta->>'name' as sender_name,
        m.created_at as timestamp
      FROM messages m
      WHERE m.client_id = $1
      ORDER BY m.created_at ASC;
    `, [id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text, senderName } = await request.json();

  try {
    // Manual response from CRM
    const result = await query(`
      INSERT INTO messages (client_id, message, meta)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [id, text, JSON.stringify({ type: 'response', name: senderName || 'Admin' })]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Insert Error:', error);
    return NextResponse.json({ error: 'Failed to insert message' }, { status: 500 });
  }
}
