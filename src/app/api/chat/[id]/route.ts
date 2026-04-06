import { NextRequest, NextResponse } from 'next/server';
import { query, asSchema } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const schema = searchParams.get('schema');

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
      FROM ${asSchema(schema, 'messages')} m
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const schema = searchParams.get('schema');
  const { text, senderName, isTrigger } = await request.json();

  if (!schema) {
    return NextResponse.json({ error: 'Schema is required' }, { status: 400 });
  }

  try {
    // 1. Fetch client info to know WHERE to send (Messenger + User ID)
    const clientResult = await query(`
      SELECT messenger, messenger_user_id, name
      FROM ${asSchema(schema, 'clients')}
      WHERE id = $1
    `, [id]);

    if (clientResult.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const client = clientResult.rows[0];

    // 2. Trigger n8n webhook for outgoing message if URL is defined
    const n8nWebhook = process.env.N8N_MESSAGE_WEBHOOK_URL;
    if (n8nWebhook && !isTrigger) {
      try {
        const response = await fetch(n8nWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: id,
            messenger: client.messenger,
            messenger_user_id: client.messenger_user_id,
            message: text,
            sender_name: senderName || 'Admin',
            project: process.env.N8N_PARENT_PROJECT,
            schema: schema,
            timestamp: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`- n8n Webhook failed with status ${response.status}: ${errorText}`);
        } else {
          console.log(`- Webhook successfully sent to n8n for client ${id}`);
        }
      } catch (webhookErr) {
        console.error('Failed to trigger n8n webhook:', webhookErr);
      }
    }

    // 3. Save manual response to CRM database for history
    const result = await query(`
      INSERT INTO ${asSchema(schema, 'messages')} (client_id, message, meta)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [id, text, JSON.stringify({ 
      type: 'response', 
      name: senderName || 'Admin',
      is_trigger: !!isTrigger
    })]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Insert Error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
