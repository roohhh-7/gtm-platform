export interface CandidatePoolCompany {
  name: string;
  domain: string;
  industry: string;
  employees: string;
  country: string;
  type: string;
  raw_data: any;
}

export interface RankedCompany extends CandidatePoolCompany {
  ai_fit_score: number;
  why_recommended: string[];
}
