import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const { contactId, contactName, companyName } = await req.json();

    if (!contactId || !contactName) {
      return NextResponse.json({ error: 'contactId and contactName are required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert B2B sales researcher. Conduct deep research on the individual: "${contactName}" who works at "${companyName || 'Unknown Company'}".
Provide your research in JSON format matching exactly this structure:
{
  "ai_personalization_notes": "A 2-3 sentence personalized hook you could use in a cold email.",
  "role": "Their likely job title or department role",
  "responsibilities": "What they are likely responsible for in their day-to-day",
  "linkedin_summary": "A brief simulated summary of their professional background",
  "recent_posts": ["Simulate 1-2 topics they might have recently posted about on LinkedIn"],
  "interests": ["List 2-3 professional interests (e.g. Cloud Native, Leadership)"],
  "mutual_connections": ["Simulate 1-2 mutual connection names if any, or empty array"],
  "personalized_talking_points": ["2-3 specific talking points to mention on a discovery call"]
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

    return NextResponse.json({ research: researchData });
  } catch (error: any) {
    console.error('Contact research generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate research' }, { status: 500 });
  }
}
