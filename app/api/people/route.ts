import { NextRequest, NextResponse } from 'next/server';
import { fetchApolloContacts } from '@/services/prospect-discovery/apollo';

export async function POST(req: NextRequest) {
  try {
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
