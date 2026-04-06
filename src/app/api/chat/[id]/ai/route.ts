import { NextRequest, NextResponse } from 'next/server';
import { query, asSchema } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const schema = searchParams.get('schema');
  
  try {
    const { enabled } = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid "enabled" parameter' }, { status: 400 });
    }

    if (!schema) {
      return NextResponse.json({ error: 'Missing schema parameter' }, { status: 400 });
    }

    // Update the is_ai_enabled flag for the specific client
    const result = await query(`
      UPDATE ${asSchema(schema, 'clients')}
      SET is_ai_enabled = $1
      WHERE id = $2
      RETURNING id, is_ai_enabled;
    `, [enabled, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ 
        message: `AI Assistant for client ${id} is now ${enabled ? 'ENABLED' : 'DISABLED'}`,
        client: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error toggling AI:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
