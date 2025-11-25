# Update Supabase SSR Package

## The Issue
You're using `@supabase/ssr` version `^0.1.0` which is very old and has known bugs with PKCE cookie handling in Next.js 14+.

## Solution: Update Package

Run this command to update:

```powershell
npm install @supabase/ssr@latest
```

Or manually update `package.json` and run `npm install`.

## After Updating

1. **Restart your dev server**
2. **Clear browser cookies**
3. **Try signing in again**

The latest version has fixes for:
- PKCE code verifier cookie handling
- Next.js 14+ route handler compatibility
- Cookie reading in middleware and route handlers

