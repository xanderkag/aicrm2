import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch active deals/orders and CRM metrics
    // For now, mirroring the data format of SalesFunnel and TelegramOrdersList
    const ordersResult = await query(`
      SELECT 
        o.id, 
        o.client_id, 
        c.messenger_user_id as client_name,
        o.status, 
        o.price, 
        o.created_at as timestamp
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 10;
    `);

    // Basic funnel metrics calculation
    const statsResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'new') as leads,
        COUNT(*) FILTER (WHERE status = 'consultation') as consultations,
        COUNT(*) FILTER (WHERE status = 'paid') as conversions,
        SUM(price) as revenue
      FROM orders;
    `);

    return NextResponse.json({
      orders: ordersResult.rows,
      stats: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Orders Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
