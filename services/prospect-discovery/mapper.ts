import { ICP } from '@/types';

/**
 * Maps the Orbital ICP to the Apollo Search API payload format.
 */
export function mapIcpToApolloPayload(icp: ICP): Record<string, any> {
  const payload: Record<string, any> = {
    per_page: 50,
  };

  if (icp.locations?.length) {
    payload.organization_locations = icp.locations;
  }

  if (icp.company_sizes?.length) {
    payload.organization_num_employees_ranges = icp.company_sizes;
  }

  if (icp.titles?.length) {
    payload.person_titles = icp.titles;
  }

  // Pass market segments and industries as keyword tags to help Apollo narrow down
  // Pass market segments and industries as keyword tags to help Apollo narrow down
  const keywords: string[] = [];
  if (icp.industries?.length) keywords.push(...icp.industries);
  if (icp.market_segments?.length) keywords.push(...icp.market_segments);
  if (icp.product_description) {
    // Extract keywords from product description (simple split by spaces for MVP, keeping words > 4 chars)
    const words = icp.product_description.split(/[\s,.-]+/).filter(w => w.length > 4);
    keywords.push(...words.slice(0, 5));
  }
  if (icp.ideal_customer_characteristics) {
    const words = icp.ideal_customer_characteristics.split(/[\s,.-]+/).filter(w => w.length > 4);
    keywords.push(...words.slice(0, 5));
  }
  
  if (keywords.length > 0) {
    payload.q_organization_keyword_tags = keywords;
  }

  if (icp.target_domains?.length) {
    payload.q_organization_domains = icp.target_domains.join('\n');
  }

  return payload;
}
