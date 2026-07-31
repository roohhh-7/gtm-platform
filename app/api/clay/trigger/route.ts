import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting (e.g., max 15 requests per minute per IP)
    const rateLimitError = checkRateLimit(request, 15, 60);
    if (rateLimitError) return rateLimitError;

    // 2. Authentication Check
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const { company_id, domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const response = await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-aa994a31-14dd-46e9-80e0-5fbfe6d16566', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_id, domain }),
    });

    if (!response.ok) {
      throw new Error(`Clay responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error triggering Clay:', error);
    return NextResponse.json({ error: error.message || 'Failed to trigger Clay' }, { status: 500 });
  }
}
