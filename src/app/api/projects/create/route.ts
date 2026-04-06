import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Generate a unique schema name
    const timestamp = Date.now();
    const schemaName = `project_${timestamp}`;

    // Use the same database URL as the main application for now
    const dbUrl = process.env.DATABASE_URL;

    // Insert the new project into public.projects
    const result = await query(`
      INSERT INTO public.projects (name, schema_name, db_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [name, schemaName, dbUrl]);

    const newProject = result.rows[0];

    // NOTE: This does NOT create the physical schema yet. 
    // In this architecture, it is expected that n8n or another service 
    // initializes the schema structure upon first interaction.
    
    console.log(`NEW PROJECT CREATED: ${name} (Schema: ${schemaName})`);

    return NextResponse.json({
        message: 'Project created successfully',
        project: newProject
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
