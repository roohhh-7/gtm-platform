import { NextResponse } from 'next/server';
import { generateCompanyResearch } from '@/services/research/gemini';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // 1. Rate Limit (Max 15 requests per minute per IP for AI routes)
    const rateLimitError = checkRateLimit(req, 15, 60);
    if (rateLimitError) return rateLimitError;

    // 2. Authentication Check
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { companyName, domain } = await req.json();

    if (!companyName || !domain) {
      return NextResponse.json({ error: 'Company Name and Domain are required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return NextResponse.json({ error: 'Integration Error: Gemini API Key is not configured' }, { status: 500 });
    }

    const data = await generateCompanyResearch(companyName, domain, geminiKey);

    return NextResponse.json({ report: data });
  } catch (error: any) {
    console.error('Research API error:', error);
    const status = error.message?.includes('Integration Error') ? 500 : 500;
    return NextResponse.json({ error: error.message || 'Failed to generate research' }, { status });
  }
}
