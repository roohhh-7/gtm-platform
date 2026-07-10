import { NextResponse } from 'next/server';
import { fetchClayContacts } from '@/services/enrichment/clay';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const clayKey = process.env.CLAY_API_KEY;

    if (!clayKey) {
      // For development, if there's no key, we can simulate an error or mock it,
      // but since we are doing true integration, we throw a 500 error to alert the user.
      return NextResponse.json({ error: 'Integration Error: Clay API Key is not configured' }, { status: 500 });
    }

    const data = await fetchClayContacts(domain, clayKey);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Enrichment API error:', error);
    const status = error.message?.includes('Integration Error') ? 500 : 500;
    return NextResponse.json({ error: error.message || 'Failed to enrich company data' }, { status });
  }
}
