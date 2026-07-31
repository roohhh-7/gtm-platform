import { createClient } from '@/lib/supabase/client';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    ...options.headers,
    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
  };

  return fetch(url, { ...options, headers });
}
