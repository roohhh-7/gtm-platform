/**
 * Modular service for AI Deep Research using Gemini (or n8n).
 */

export async function generateCompanyResearch(companyName: string, domain: string, apiKey: string) {
  // If we are using an n8n webhook, we would hit that endpoint here instead of Gemini directly.
  const isN8n = !!process.env.GEMINI_WEBHOOK_URL;
  const endpoint = process.env.GEMINI_WEBHOOK_URL || `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `You are an expert sales strategist.
Analyze the company: ${companyName} (${domain}).
Provide a 9-part structured intelligence report for a B2B sales outreach campaign.
Format your response as a JSON array of strings, where each string is a detailed paragraph for one of the following steps:
1. Company Overview
2. Growth Signals
3. Tech Stack
4. Decision Makers
5. AI Summary
6. Opportunity Signals
7. Pain Points
8. Outreach Angles
9. Recent News

Return ONLY a valid JSON array of 9 strings. No markdown formatting outside the array, no extra text.`;

  try {
    const payload = isN8n 
      ? { companyName, domain, prompt } 
      : { contents: [{ parts: [{ text: prompt }] }] };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 403) {
        throw new Error('Integration Error: Invalid Gemini API Key or Request');
      }
      throw new Error(`Research failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response
    if (isN8n) {
      return data.report; // Assuming n8n returns { report: [...] }
    } else {
      // Extract text from Gemini response
      let text = data.candidates[0].content.parts[0].text;
      // Clean up potential markdown formatting from Gemini
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedArray = JSON.parse(text);
      if (!Array.isArray(parsedArray) || parsedArray.length !== 9) {
        throw new Error('Invalid format returned from Gemini');
      }
      return parsedArray;
    }

  } catch (error: any) {
    if (error.message.includes('Integration Error')) {
      throw error;
    }
    console.error('Gemini fetch error:', error);
    throw new Error('Failed to generate research data from Gemini/n8n.');
  }
}
