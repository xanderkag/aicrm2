import { NextRequest, NextResponse } from 'next/server';
import { query, asSchema } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const schema = searchParams.get('schema');
    const body = await request.json();
    const { meta } = body;

    if (!schema) {
      return NextResponse.json({ error: 'Schema is required' }, { status: 400 });
    }

    // Use JSONB merge operator (||) to update meta without losing other keys
    // Example: UPDATE clients SET meta = meta || '{"tags": ["urgent"]}' WHERE id = 1
    const result = await query(`
      UPDATE ${asSchema(schema, 'clients')}
      SET meta = COALESCE(meta, '{}'::jsonb) || $1::jsonb
      WHERE id = $2
      RETURNING id, meta;
    `, [JSON.stringify(meta), id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
