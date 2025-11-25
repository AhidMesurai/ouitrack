# Fix: PKCE Error - "code verifier should be non-empty"

## The Problem
```
Error: invalid request: both auth code and code verifier should be non-empty
```

This error means the OAuth flow is not going through Supabase properly. The code you're receiving is likely coming directly from Google, not from Supabase.

## Root Cause

When using Supabase Auth with OAuth, the flow should be:
1. User clicks "Sign in with Google"
2. **Supabase** redirects to Google (not your app)
3. Google redirects to **Supabase's callback URL** (not your app's)
4. Supabase exchanges the OAuth code for a session
5. Supabase redirects to your `redirectTo` URL with a **session code** (not OAuth code)

If you're getting a PKCE error, it means step 4 isn't happening - Supabase isn't handling the OAuth exchange.

## Solution: Verify Supabase OAuth Configuration

### Step 1: Check Supabase Redirect URL
1. Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Look at the **"Redirect URL"** shown
3. It should be: `https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback`

### Step 2: Verify in Google Cloud Console
1. Go to **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click on your **OAuth 2.0 Client ID**
3. Under **"Authorized redirect URIs"**, make sure you have:
   ```
   https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback
   ```
4. **IMPORTANT**: This must be the EXACT URL from Supabase (case-sensitive, no trailing slash)

### Step 3: Verify Supabase OAuth Settings
1. In **Supabase Dashboard** → **Authentication** → **Providers** → **Google**:
   - ✅ Google provider is **enabled** (toggle ON)
   - ✅ **Client ID** matches your Google Cloud Console Client ID
   - ✅ **Client Secret** matches your Google Cloud Console Client Secret
2. Click **"Save"** if you made any changes

### Step 4: Check OAuth Consent Screen
1. Go to **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**
2. Make sure:
   - App is published OR you're added as a test user
   - Required scopes are added

## Common Issues

### Issue 1: Redirect URI Mismatch
**Symptom**: PKCE error, OAuth flow not working

**Fix**: 
- Copy the EXACT redirect URL from Supabase
- Add it to Google Cloud Console's authorized redirect URIs
- Make sure there are no typos, extra spaces, or trailing slashes

### Issue 2: Supabase OAuth Not Enabled
**Symptom**: Redirects directly to your app's callback with a Google code

**Fix**:
- Enable Google provider in Supabase
- Make sure Client ID and Secret are correct

### Issue 3: Wrong Redirect URL in Google Cloud
**Symptom**: Google rejects the redirect

**Fix**:
- Remove any redirect URIs pointing to `http://localhost:3000/auth/callback` (if you added it)
- Only use the Supabase callback URL: `https://xxxxx.supabase.co/auth/v1/callback`

## Testing the Fix

1. **Clear browser cookies** for localhost:3000
2. **Restart your dev server**: `npm run dev`
3. Try signing in again
4. The flow should be:
   - Click "Sign in with Google"
   - Redirected to Google (not your app)
   - After authorizing, redirected to Supabase
   - Then redirected to your app's `/auth/callback`
   - Finally redirected to `/dashboard`

## Still Not Working?

If you're still getting the PKCE error:

1. **Double-check the redirect URI** - It must match EXACTLY
2. **Wait a few minutes** - Google Cloud changes can take time to propagate
3. **Check Supabase logs** - Go to Supabase Dashboard → Logs → Auth logs
4. **Try in incognito mode** - Rules out cookie/cache issues

## Quick Checklist

- [ ] Supabase redirect URL is in Google Cloud Console's authorized redirect URIs
- [ ] URLs match EXACTLY (case-sensitive, no trailing slash)
- [ ] Google OAuth provider is enabled in Supabase
- [ ] Client ID and Secret are correct in Supabase
- [ ] OAuth consent screen is configured
- [ ] You're added as a test user (if app is in testing mode)

