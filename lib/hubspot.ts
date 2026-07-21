export async function syncCompanyToHubSpot(companyData: any, hubspotToken: string) {
  const url = 'https://api.hubapi.com/crm/v3/objects/companies';
  
  // Try to find existing company first by domain
  const searchUrl = 'https://api.hubapi.com/crm/v3/objects/companies/search';
  const searchBody = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'domain',
            operator: 'EQ',
            value: companyData.domain
          }
        ]
      }
    ],
    properties: ['domain', 'name']
  };

  const searchRes = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hubspotToken}`
    },
    body: JSON.stringify(searchBody)
  });

  const searchData = await searchRes.json();
  let companyId = null;

  const properties = {
    domain: companyData.domain,
    name: companyData.name || companyData.domain,
    description: companyData.raw_data?.description || '',
    country: companyData.country || companyData.raw_data?.country || '',
    founded_year: companyData.raw_data?.founded || '',
    linkedin_company_page: companyData.raw_data?.linkedin_url || ''
  };

  // Clean up empty properties
  Object.keys(properties).forEach(key => {
    if (!properties[key as keyof typeof properties]) {
      delete properties[key as keyof typeof properties];
    }
  });

  if (searchData.total > 0) {
    // Update existing
    companyId = searchData.results[0].id;
    const updateRes = await fetch(`${url}/${companyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotToken}`
      },
      body: JSON.stringify({ properties })
    });
    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error('HubSpot Update Error:', err);
      throw new Error(`HubSpot Error: ${err}`);
    }
  } else {
    // Create new
    const createRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotToken}`
      },
      body: JSON.stringify({ properties })
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('HubSpot Create Error:', err);
      throw new Error(`HubSpot Error: ${err}`);
    }
    const createData = await createRes.json();
    companyId = createData.id;
  }

  return companyId;
}
