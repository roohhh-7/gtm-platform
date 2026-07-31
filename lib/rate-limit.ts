import { NextResponse } from 'next/server';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// In-memory store for rate limiting. 
// Note: In serverless environments (like Vercel), this state is kept per-instance and will reset 
// when the instance spins down. It's not a perfect distributed rate limiter, but it provides 
// a solid layer of defense against high-volume burst spamming without needing a paid Redis DB.
const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(req: Request, maxRequests: number, windowSeconds: number) {
  // Extract IP from headers (works on Vercel and most proxies)
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'anonymous';
             
  const now = Date.now();
  const resetTime = now + windowSeconds * 1000;

  const currentEntry = rateLimitMap.get(ip);

  if (!currentEntry) {
    rateLimitMap.set(ip, { count: 1, resetAt: resetTime });
    return null; // Passed
  }

  // If the window has expired, reset the count
  if (now > currentEntry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: resetTime });
    return null; // Passed
  }

  // If within the window, check the limit
  if (currentEntry.count >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((currentEntry.resetAt - now) / 1000).toString(),
        }
      }
    );
  }

  // Increment count
  currentEntry.count++;
  rateLimitMap.set(ip, currentEntry);
  return null; // Passed
}
