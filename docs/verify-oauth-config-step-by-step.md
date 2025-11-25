# Step-by-Step: Verify OAuth Configuration

## The Issue
You're getting a PKCE error because Google is redirecting directly to your app instead of going through Supabase first.

## Step-by-Step Verification

### STEP 1: Get Supabase Redirect URL

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click **"Providers"** tab
5. Find **"Google"** in the list
6. Click on **"Google"** to expand settings
7. Look for **"Redirect URL"** section
8. **COPY THE EXACT URL** shown (it will look like: `https://xxxxx.supabase.co/auth/v1/callback`)

**Write it down here:**
```
https://________________________________________________
```

---

### STEP 2: Verify Google Cloud Console Redirect URI

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Find your **OAuth 2.0 Client ID** (the one you created for this app)
5. **Click on it** to edit
6. Scroll down to **"Authorized redirect URIs"**

**Check if you see the Supabase URL from Step 1**

#### If the Supabase URL is NOT there:
1. Click **"+ ADD URI"**
2. Paste the exact Supabase URL from Step 1
3. **IMPORTANT**: Make sure it matches EXACTLY:
   - Same case (lowercase/uppercase)
   - No trailing slash
   - No extra spaces
4. Click **"SAVE"** at the bottom

#### If the Supabase URL IS there:
1. Make sure it matches EXACTLY (no typos)
2. If it doesn't match, delete it and add the correct one
3. Click **"SAVE"**

#### Remove any localhost redirect URIs:
- If you see `http://localhost:3000/auth/callback`, **DELETE IT**
- We only need the Supabase URL

---

### STEP 3: Verify Supabase Google Provider Settings

1. Go back to **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Check these settings:

#### Setting 1: Enable Google Provider
- Toggle should be **ON** (enabled)
- If it's OFF, turn it ON

#### Setting 2: Client ID (for OAuth)
- This should match your **Google Cloud Console Client ID**
- To verify: Go to Google Cloud Console → Credentials → Your OAuth Client
- Copy the **Client ID** (not the Client Secret)
- Compare it with what's in Supabase
- If they don't match, paste the correct one in Supabase

#### Setting 3: Client Secret (for OAuth)
- This should match your **Google Cloud Console Client Secret**
- To verify: Go to Google Cloud Console → Credentials → Your OAuth Client
- If you can't see the secret, you may need to create a new one or reset it
- Copy it and paste in Supabase

3. After verifying/updating, click **"SAVE"** at the bottom

---

### STEP 4: Verify OAuth Consent Screen

1. Go to **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**
2. Make sure:
   - App is **published** OR you're added as a **test user**
   - If in testing mode, add your email as a test user
   - Required scopes are added

---

### STEP 5: Wait and Test

1. **Wait 2-3 minutes** for changes to propagate
2. **Clear browser cookies** for localhost:3000
3. **Restart your dev server**:
   ```powershell
   # Stop server (Ctrl+C)
   npm run dev
   ```
4. Try signing in again

---

## Common Mistakes to Avoid

❌ **Wrong**: Adding `http://localhost:3000/auth/callback` to Google Cloud Console
✅ **Correct**: Only add the Supabase callback URL

❌ **Wrong**: Redirect URI has trailing slash: `https://xxxxx.supabase.co/auth/v1/callback/`
✅ **Correct**: No trailing slash: `https://xxxxx.supabase.co/auth/v1/callback`

❌ **Wrong**: Client ID/Secret don't match between Google Cloud and Supabase
✅ **Correct**: They must match exactly

❌ **Wrong**: Google provider disabled in Supabase
✅ **Correct**: Google provider must be enabled

---

## Quick Checklist

Before testing, verify:

- [ ] Supabase redirect URL copied correctly
- [ ] Supabase redirect URL added to Google Cloud Console (exact match)
- [ ] No localhost redirect URIs in Google Cloud Console
- [ ] Google provider enabled in Supabase
- [ ] Client ID matches between Google Cloud and Supabase
- [ ] Client Secret matches between Google Cloud and Supabase
- [ ] OAuth consent screen configured
- [ ] Waited 2-3 minutes after making changes
- [ ] Cleared browser cookies
- [ ] Restarted dev server

---

## Still Not Working?

If you've verified everything and it's still not working:

1. **Double-check the redirect URI** - Copy it character by character
2. **Check Supabase logs**: Dashboard → Logs → Auth logs
3. **Try in incognito/private mode** - Rules out cookie issues
4. **Check browser console** (F12) for any errors

---

## Expected Flow (When Working Correctly)

1. User clicks "Sign in with Google"
2. Browser redirects to: `accounts.google.com/...` (Google's OAuth page)
3. User authorizes
4. Browser redirects to: `https://xxxxx.supabase.co/auth/v1/callback?code=...` (Supabase)
5. Supabase processes the OAuth code
6. Browser redirects to: `http://localhost:3000/auth/callback?code=...` (Your app)
7. Your app exchanges the session code
8. Browser redirects to: `http://localhost:3000/dashboard` (Success!)

If step 4 is missing (you go directly from Google to your app), that's the problem!

