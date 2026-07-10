import { CandidatePoolCompany } from './types';

/**
 * Fetches prospects from Apollo API and normalizes the response.
 */
export async function fetchApolloCandidates(payload: Record<string, any>, apiKey: string): Promise<CandidatePoolCompany[]> {
  const apolloRes = await fetch('https://api.apollo.io/v1/organizations/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (apolloRes.status === 401) {
    throw new Error('Integration Error: Invalid Apollo API Key');
  }

  if (apolloRes.status === 429) {
    const retryAfter = apolloRes.headers.get('retry-after') || '60';
    throw new Error(`Apollo is currently busy. Please try again in ${retryAfter} seconds.`);
  }

  if (!apolloRes.ok) {
    throw new Error('Failed to fetch prospects from Apollo');
  }

  const data = await apolloRes.json();
  const organizations = data.organizations || [];

  return organizations.map((org: any) => ({
    name: org.name,
    domain: org.primary_domain || org.website_url,
    industry: org.industry || (org.keywords ? org.keywords.join(', ') : 'Unknown'),
    employees: org.estimated_num_employees ? `${org.estimated_num_employees}` : 'Unknown',
    country: org.country || 'Unknown',
    type: org.industry || 'Unknown',
    raw_data: org
  }));
}

export async function fetchApolloContacts(domain: string, apiKey: string) {
  // Mock data fallback for free tier Apollo API users testing the UI
  return [
    { id: '1', name: 'John Doe [Mock]', title: 'Chief Executive Officer', email: 'j.doe@' + domain, linkedin: '#' },
    { id: '2', name: 'Sarah Smith [Mock]', title: 'VP of Engineering', email: 'sarah@' + domain, linkedin: '#' },
    { id: '3', name: 'Michael Chen [Mock]', title: 'Product Manager', email: 'michael.c@' + domain, linkedin: '#' },
    { id: '4', name: 'Emma Wilson [Mock]', title: 'Head of Marketing', email: 'ewilson@' + domain, linkedin: '#' },
    { id: '5', name: 'David Brown [Mock]', title: 'Sales Director', email: 'david.b@' + domain, linkedin: '#' },
    { id: '6', name: 'James Taylor [Mock]', title: 'Chief Financial Officer', email: 'jtaylor@' + domain, linkedin: '#' },
    { id: '7', name: 'Olivia Davis [Mock]', title: 'HR Manager', email: 'olivia.d@' + domain, linkedin: '#' },
    { id: '8', name: 'William Miller [Mock]', title: 'Lead Developer', email: 'william@' + domain, linkedin: '#' },
    { id: '9', name: 'Sophia Moore [Mock]', title: 'Customer Success', email: 'smoore@' + domain, linkedin: '#' },
    { id: '10', name: 'Daniel Anderson [Mock]', title: 'Operations Lead', email: 'daniel.a@' + domain, linkedin: '#' }
  ];
}
