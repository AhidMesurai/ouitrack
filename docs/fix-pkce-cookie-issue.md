# Fix: PKCE Code Verifier Cookie Not Found

## The Problem
The code verifier cookie is not being found when the callback route tries to exchange the code for a session.

## Root Cause
When using Supabase SSR with OAuth, the PKCE code verifier is stored in a cookie when the OAuth flow starts. However, this cookie might not be accessible or might be lost during the redirect flow.

## Solution 1: Clear Cookies and Try Again

1. **Clear all browser cookies** for localhost:3000
2. **Use Incognito/Private mode** for testing
3. Try signing in again

## Solution 2: Check Cookie Settings

The issue might be related to cookie SameSite or Secure settings. Make sure:

1. You're using `http://localhost:3000` (not `https://`)
2. Cookies are not being blocked by browser settings
3. Third-party cookies are allowed (if needed)

## Solution 3: Verify Supabase SSR Setup

Make sure your Supabase client is set up correctly:

### Client-side (`lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server-side (`lib/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  )
}
```

## Solution 4: Alternative Approach - Use Supabase's Built-in Handler

If the cookie issue persists, you might need to let Supabase handle the entire OAuth flow without a custom callback route. However, this requires different configuration.

## Debugging Steps

1. **Check browser cookies**:
   - Open DevTools (F12) → Application → Cookies
   - Look for cookies starting with `sb-` or containing `code-verifier`
   - Check if they exist before and after the redirect

2. **Check server logs**:
   - Look at terminal output when callback is hit
   - Check what cookies are available
   - Verify the code verifier cookie name

3. **Test in different browsers**:
   - Try Chrome, Firefox, Edge
   - Some browsers handle cookies differently

## Temporary Workaround

If nothing works, you can try:
1. Using a different OAuth flow (if Supabase supports it)
2. Storing the code verifier in localStorage (not recommended for production)
3. Using Supabase's hosted auth pages

## Most Likely Fix

**Try this first:**
1. Clear ALL cookies for localhost:3000
2. Close and reopen your browser
3. Restart your dev server
4. Try signing in in Incognito mode

This usually fixes cookie-related issues.

