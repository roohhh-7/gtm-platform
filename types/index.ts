export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  industry?: string;
  status: CampaignStatus | 'archived';
  sent: number;
  replies: number;
  meetings: number;
  created_at: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface ICP {
  id: string;
  campaign_id: string;
  user_id: string;
  titles: string[];
  industries: string[];
  company_sizes: string[];
  locations: string[];
  product_description?: string;
  problem_statement?: string;
  market_segments: string[];
  ideal_customer_characteristics?: string;
  target_domains?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  industry?: string;
  employees?: string;
  domain?: string;
  tags: string[];
  country?: string;
  raw_data?: Record<string, any>;
  created_at: string;
}

export interface CampaignCompany {
  campaign_id: string;
  company_id: string;
  status: 'prospect' | 'active' | 'disqualified';
  added_at: string;
  company?: Company; // For joined queries
  ai_fit_score?: number;
  why_recommended?: string[];
}

export interface Contact {
  id: string;
  user_id: string;
  company_id: string;
  name: string;
  role?: string;
  email?: string;
  linkedin_url?: string;
  created_at: string;
  company?: Company; // For joined queries
}

export interface CampaignContact {
  campaign_id: string;
  contact_id: string;
  status: 'prospect' | 'sent' | 'replied' | 'bounced';
  added_at: string;
  contact?: Contact; // For joined queries
}

export interface CompanyResearch {
  id: string;
  user_id: string;
  company_id: string;
  ai_summary?: string;
  industry?: string;
  funding?: string;
  tech_stack: string[];
  competitors: string[];
  recent_news: { title: string; source: string; date: string }[];
  hiring_signals: string[];
  pain_points: string[];
  buying_signals: { signal: string; strength: 'Low' | 'Medium' | 'High' }[];
  created_at: string;
  updated_at: string;
}

export interface ContactResearch {
  id: string;
  user_id: string;
  contact_id: string;
  ai_personalization_notes?: string;
  role?: string;
  responsibilities?: string;
  linkedin_summary?: string;
  recent_posts: string[];
  interests: string[];
  mutual_connections: string[];
  personalized_talking_points: string[];
  created_at: string;
  updated_at: string;
}

export interface OutreachEmail {
  id: string;
  user_id: string;
  campaign_id: string;
  contact_id: string;
  subject: string;
  body: string;
  status: 'draft' | 'approved' | 'sent' | 'bounced' | 'replied';
  context_used: string[];
  created_at: string;
  updated_at: string;
}
