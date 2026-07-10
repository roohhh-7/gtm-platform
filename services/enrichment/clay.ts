/**
 * Modular service for Company Enrichment using Clay (or n8n).
 * This service takes a domain and returns enriched contact data.
 */

export async function fetchClayContacts(domain: string, apiKey: string) {
  // If we are using an n8n webhook, we would hit that endpoint here instead of Clay directly.
  // We allow overriding the endpoint via ENV for easy swapping to n8n.
  const endpoint = process.env.CLAY_WEBHOOK_URL || 'https://api.clay.com/v3/workspaces/search';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        domain: domain,
        // Additional configuration can be sent here depending on the n8n/Clay setup
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Integration Error: Invalid Clay API Key');
      }
      throw new Error(`Enrichment failed with status: ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If Clay returns "OK" or non-JSON, it means it's an async webhook
      // For now, we'll return an empty array or throw a specific error
      if (text === 'OK') {
        throw new Error('Clay returned an async "OK". Please configure Clay to return a synchronous JSON response.');
      }
      throw new Error(`Invalid JSON from Clay: ${text}`);
    }

    return data;
  } catch (error: any) {
    // If there is an integration error, propagate it
    if (error.message.includes('Integration Error')) {
      throw error;
    }
    console.error('Clay fetch error:', error);
    throw new Error('Failed to fetch enrichment data from Clay/n8n.');
  }
}
