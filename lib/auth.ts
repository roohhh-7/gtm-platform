import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized. Authentication required.' },
        { status: 401 }
      )
    };
  }

  return { user, errorResponse: null };
}
