import { NextRequest, NextResponse } from 'next/server';
import { query, asSchema } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const schema = searchParams.get('schema');

    if (!schema) {
      return NextResponse.json({ error: 'Schema is required' }, { status: 400 });
    }

    const result = await query(`
      SELECT id, messenger, messenger_user_id, is_ai_enabled, name, meta
      FROM ${asSchema(schema, 'clients')}
      WHERE id = $1
    `, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const schema = searchParams.get('schema');
    const body = await request.json();
    const { meta, name } = body;

    if (!schema) {
      return NextResponse.json({ error: 'Schema is required' }, { status: 400 });
    }

    // Prepare dynamic update query
    let updateQuery = `UPDATE ${asSchema(schema, 'clients')} SET `;
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateQuery += `name = $${paramCount++}, `;
      values.push(name);
    }

    if (body.is_ai_enabled !== undefined) {
      updateQuery += `is_ai_enabled = $${paramCount++}, `;
      values.push(body.is_ai_enabled);
    }

    if (meta !== undefined) {
      updateQuery += `meta = COALESCE(meta, '{}'::jsonb) || $${paramCount++}::jsonb, `;
      values.push(JSON.stringify(meta));
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount} RETURNING id, name, meta;`;
    values.push(id);

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
