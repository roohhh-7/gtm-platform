import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60; // Allow more time for LLM execution

export async function POST(req: Request) {
  try {
    const { campaignId, contactId, companyId, contactName, contactRole, companyName } = await req.json();

    if (!campaignId || !contactId || !companyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Fetch company research from the database
    const supabase = await createClient();
    const { data: research } = await supabase
      .from('company_research')
      .select('*')
      .eq('company_id', companyId)
      .maybeSingle();

    // Fetch the ICP (Ideal Customer Profile) for context on what we are selling
    const { data: icp } = await supabase
      .from('icp')
      .select('*')
      .eq('campaign_id', campaignId)
      .maybeSingle();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    let companyContext = '';
    if (research) {
      companyContext = `
Company Overview: ${research.company_overview || research.summary || 'N/A'}
Why Now / Triggers: ${research.why_now || 'N/A'}
Growth Signals: ${JSON.stringify(research.growth_signals || [])}
Pain Points: ${JSON.stringify(research.pain_points || [])}
Outreach Angles: ${JSON.stringify(research.outreach_angles || [])}
      `;
    }

    let sellingContext = '';
    if (icp && (icp.product_description || icp.problem_statement)) {
      sellingContext = `
What we are selling / Our Value Proposition:
Product Description: ${icp.product_description || 'N/A'}
Problem we solve: ${icp.problem_statement || 'N/A'}
      `;
    }

    const prompt = `You are an elite B2B sales development representative writing a highly personalized cold email.
Your goal is to write a short, punchy, and compelling email to ${contactName}, whose role is ${contactRole} at ${companyName}.

Here is the research we have on their company:
${companyContext}
${sellingContext}

Instructions:
1. Subject line must be short, intriguing, and personalized. (max 5 words)
2. Body must be under 120 words. Keep it highly readable with short paragraphs.
3. Personalize the hook based on the "Why Now" or "Growth Signals" if available.
4. Align what we are selling (see Value Proposition) with their "Pain Points" and "Outreach Angles".
5. End with a low-friction, soft call to action (e.g., "Open to a quick chat?").
6. Provide a list of "context_used" (2-3 bullet points) summarizing exactly what specific research points you used to personalize the email.

Provide your output in strict JSON format exactly matching this structure:
{
  "subject": "string",
  "body": "string (use \\n for line breaks, sign off as 'Rohit')",
  "context_used": ["string", "string"]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      subject: parsed.subject,
      body: parsed.body,
      context_used: parsed.context_used,
    });
  } catch (error: any) {
    console.error('Error generating outreach:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate outreach' }, { status: 500 });
  }
}
