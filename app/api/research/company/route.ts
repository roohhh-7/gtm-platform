import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { researchService } from '@/services/research';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const { companyId, companyName, customQuestion } = await req.json();

    if (!companyId || !companyName) {
      return NextResponse.json({ error: 'companyId and companyName are required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest available 2026 model string
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are an expert B2B sales researcher. Conduct deep research on the company: "${companyName}".
${customQuestion ? `The user also asked a specific question: "${customQuestion}". Please answer this in the 'custom_question_answer' field.` : ''}

Provide your research in JSON format matching exactly this structure:
{
  "why_now": "Why this company is a good prospect right now.",
  "company_overview": "A quick snapshot of what the company does.",
  "ai_summary": "A 2-3 sentence summary of what the company does and its market positioning.",
  "industry": "Primary industry (e.g., Enterprise Software, FinTech)",
  "funding": "Latest funding round and amount if known, else 'Private' or 'Public'",
  "growth_signals": ["Hiring, expansion, employee growth, product launches, funding activity"],
  "decision_makers": ["Recommended contacts or roles for outreach"],
  "outreach_angles": ["Personalized messaging ideas for the sales team"],
  "timeline": [
    { "date": "Date or timeframe", "event": "A chronological view of major events (funding, launches, hiring, expansion, etc)" }
  ],
  "tech_stack": ["List", "of", "technologies", "used", "by", "company"],
  "competitors": ["Competitor A", "Competitor B"],
  "recent_news": [
    { "title": "Headline", "source": "News source", "date": "Approximate date or timeframe" }
  ],
  "hiring_signals": ["Roles they are currently hiring for"],
  "pain_points": ["Likely challenges or pain points this company faces at their current stage"],
  "buying_signals": [
    { "signal": "Event or indicator that they might buy software soon", "strength": "High, Medium, or Low" }
  ]${customQuestion ? `,\n  "custom_question_answer": "Your answer to the custom question asked by the user."` : ''}
}

Return ONLY valid JSON. Do not include markdown formatting or extra text.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    const researchData = JSON.parse(responseText);

    // Save to database
    // Wait, the client might not pass auth cookies to this route unless we pass auth headers, 
    // or we just return it to the client and let the client save it!
    // Since the client has the auth token, returning it to the client and letting the client save it is safer.
    
    return NextResponse.json({ research: researchData });
  } catch (error: any) {
    console.error('Company research generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate research' }, { status: 500 });
  }
}
