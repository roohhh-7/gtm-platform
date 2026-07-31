import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createJSClient } from '@supabase/supabase-js';

export async function requireAuth(req?: Request) {
  let user = null;
  let error = null;

  // 1. Try to authenticate via Authorization Bearer token header
  if (req) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const supabase = createJSClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const result = await supabase.auth.getUser(token);
      user = result.data.user;
      error = result.error;
    }
  }

  // 2. Fall back to reading the cookie
  if (!user) {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data?.user;
    error = result.error;
  }

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
