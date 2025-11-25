# Debug: auth_failed Error

## The Problem
You're seeing `?error=auth_failed` in the URL, which means the code exchange is failing.

## Common Causes

### 1. Redirect URI Mismatch
The redirect URI in Google Cloud Console doesn't match what Supabase is using.

**Check:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", make sure you have:
   ```
   https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback
   ```
4. The URL must match EXACTLY (case-sensitive, no trailing slash)

### 2. Supabase OAuth Not Configured
Google OAuth provider might not be properly configured in Supabase.

**Check:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Make sure Google provider is **enabled**
3. Verify Client ID and Client Secret are correct
4. Check the redirect URL shown matches what's in Google Cloud Console

### 3. Environment Variables Missing
Supabase URL or keys might be missing or incorrect.

**Check your `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uhbtmofnemtwlorxyzxc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. OAuth Consent Screen Issues
Your OAuth consent screen might not be properly configured.

**Check:**
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Make sure it's published or you're added as a test user
3. Verify all required scopes are added

## Debugging Steps

### Step 1: Check Server Logs
Look at your terminal where `npm run dev` is running. You should see error messages like:
```
Error exchanging code for session: [error details]
```

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try signing in again
4. Look for the `/auth/callback` request
5. Check the response - it might have error details

### Step 4: Verify Supabase Configuration
1. Go to Supabase Dashboard
2. Settings → API
3. Copy the exact Project URL
4. Make sure it matches your `.env.local`

### Step 5: Test Redirect URI
The redirect URI in Supabase should be:
```
https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback
```

Make sure this EXACT URL is in Google Cloud Console's authorized redirect URIs.

## Quick Fix Checklist

- [ ] Redirect URI in Google Cloud Console matches Supabase callback URL exactly
- [ ] Google OAuth provider is enabled in Supabase
- [ ] Client ID and Secret are correct in Supabase
- [ ] Environment variables are set correctly
- [ ] OAuth consent screen is configured
- [ ] You're added as a test user (if app is in testing mode)

## Most Common Fix

**99% of the time, it's a redirect URI mismatch:**

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Copy the exact redirect URL shown
3. Go to Google Cloud Console → Credentials → Your OAuth Client
4. Make sure that EXACT URL is in "Authorized redirect URIs"
5. Save in Google Cloud Console
6. Try signing in again

## Still Not Working?

Check the error details in the URL. The updated login page will now show more specific error messages. Look for:
- `?error=auth_failed&details=...` - This will show the actual error message
- Check your terminal/server logs for detailed error information

