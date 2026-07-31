import { NextRequest, NextResponse } from 'next/server';
import { fetchApolloContacts } from '@/services/prospect-discovery/apollo';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit (Max 15 requests per minute per IP for AI/Data routes)
    const rateLimitError = checkRateLimit(req, 15, 60);
    if (rateLimitError) return rateLimitError;

    // 2. Authentication Check
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { domain } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const apiKey = process.env.APOLLO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Apollo API Key' }, { status: 500 });
    }

    const contacts = await fetchApolloContacts(domain, apiKey);
    
    return NextResponse.json({ contacts });
  } catch (error: any) {
    console.error('Apollo People fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch people from Apollo' }, { status: 500 });
  }
}
