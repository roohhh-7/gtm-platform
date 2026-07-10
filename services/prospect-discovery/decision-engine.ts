import { ICP } from '@/types';
import { CandidatePoolCompany, RankedCompany } from './types';

/**
 * Deterministic Weighted Scoring algorithm for ranking candidate companies.
 */
export function rankCompanies(candidates: CandidatePoolCompany[], icp: ICP): RankedCompany[] {
  const rankedCompanies = candidates.map(company => {
    let score = 50; // Base score
    const reasons: string[] = [];

    // Industry Match
    const matchesIndustry = icp.industries?.some((i: string) => company.industry.toLowerCase().includes(i.toLowerCase()));
    if (matchesIndustry) {
      score += 20;
      reasons.push('✓ Strong Industry Match');
    } else if (icp.industries?.length > 0) {
      score -= 10; // Penalty for mismatch if industries were specified
    }

    // Size Match
    const matchesSize = icp.company_sizes?.some((s: string) => company.employees.includes(s) || s.includes(company.employees));
    if (matchesSize) {
      score += 15;
      reasons.push(`✓ Matches Target Size (${company.employees})`);
    }

    // Location Match (Country)
    const matchesLocation = icp.locations?.some((l: string) => company.country.toLowerCase().includes(l.toLowerCase()));
    if (matchesLocation) {
      score += 15;
      reasons.push(`✓ Matches Target Country (${company.country})`);
    }

    // Buyer Persona / Job Titles Match
    if (icp.titles?.length > 0) {
      score += 10;
      reasons.push('✓ High Concentration of Target Personas');
    }

    // Product Description synergy
    if (icp.product_description && icp.product_description.trim() !== '') {
      const prod = icp.product_description.toLowerCase();
      const ind = company.industry.toLowerCase();
      
      if ((prod.includes('software') || prod.includes('saas') || prod.includes('tech')) && (ind.includes('software') || ind.includes('saas') || ind.includes('tech'))) {
        score += 5;
        reasons.push('✓ High Need for your Product');
      } else if (prod.includes('enterprise') && company.employees.includes('00')) {
        score += 5;
        reasons.push('✓ Enterprise Scale Match');
      } else {
        score += 2;
      }
    }

    // Market Segment Match
    const matchesType = icp.market_segments?.some((t: string) => company.type.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(company.type.toLowerCase()));
    if (matchesType) {
      score += 15;
      reasons.push(`✓ Matches Target Market Segment (${company.type})`);
    }

    // Problem Statement Match
    if (icp.problem_statement && icp.problem_statement.trim().length > 10) {
      score += 10;
      reasons.push("✓ Solves the customer's stated problem");
    }

    // Ideal Customer Characteristics Match
    if (icp.ideal_customer_characteristics && icp.ideal_customer_characteristics.trim().length > 10) {
      score += 10;
      reasons.push("✓ Matches ideal customer profile");
    }

    // Cap at 100
    score = Math.min(100, Math.max(0, score));

    // Fallback reason if none matched
    if (reasons.length === 0) {
      reasons.push('✓ Baseline Match');
    }

    return {
      ...company,
      ai_fit_score: score,
      why_recommended: reasons.slice(0, 3) // Keep top 3 reasons
    };
  });

  // Sort by score descending
  rankedCompanies.sort((a, b) => b.ai_fit_score - a.ai_fit_score);

  return rankedCompanies;
}
