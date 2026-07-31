import { NextResponse } from 'next/server';
import { extractText, getDocumentProxy } from 'unpdf';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (e.g., max 15 requests per minute per IP)
    const rateLimitError = checkRateLimit(req, 15, 60);
    if (rateLimitError) return rateLimitError;

    // 2. Authentication Check
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse PDF' }, { status: 500 });
  }
}
