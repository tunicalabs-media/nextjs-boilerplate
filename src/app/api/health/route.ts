import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * A simple health-check API route handler.
 * Demonstrates the Route Handler pattern with `route.ts`.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
