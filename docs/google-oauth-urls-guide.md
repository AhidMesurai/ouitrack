# Google OAuth: Authorized JavaScript Origins & Redirect URIs

## What to Add in Google Cloud Console

When creating OAuth 2.0 credentials in Google Cloud Console, you need to add specific URLs. Here's exactly what to add:

---

## Authorized JavaScript Origins

These are the domains where your application runs (where users will initiate the OAuth flow).

### For Development (Local):
```
http://localhost:3000
```

### For Production:
```
https://your-domain.com
https://www.your-domain.com  (if you use www)
```

**Notes:**
- Must include protocol (`http://` or `https://`)
- No trailing slash
- No path (just domain and port if needed)
- For Next.js, this is where your app runs

---

## Authorized Redirect URIs

These are the URLs where Google will send users back after they authorize your app.

### ⚠️ IMPORTANT: You Need the Supabase One!

When using Supabase Auth, Google redirects to **Supabase's callback URL**, not directly to your app.

### Required (Supabase Callback):
```
https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback
```
**This is the one from your Supabase Dashboard** - This is the PRIMARY redirect URI you need!

### Optional (Your App Callback):
```
http://localhost:3000/auth/callback
```
This is only needed if you have custom OAuth handling. For Supabase Auth, the Supabase callback is sufficient.

### For Production:
```
https://your-domain.com/auth/callback
```
(Only if you're not using Supabase Auth in production)

**Notes:**
- Must match EXACTLY (case-sensitive, no trailing slashes)
- Include the full path
- Supabase redirect URI is required for Supabase Auth to work

---

## Complete Example Setup

### Development Setup:

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

### Production Setup:

**Authorized JavaScript origins:**
```
https://analytics-saas.com
https://www.analytics-saas.com
```

**Authorized redirect URIs:**
```
https://analytics-saas.com/auth/callback
https://www.analytics-saas.com/auth/callback
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

---

## How to Find Your Supabase Redirect URI

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Click on **Google** provider
5. Look for the **"Redirect URL"** section
6. Copy the URL shown (format: `https://xxxxx.supabase.co/auth/v1/callback`)

---

## Common Mistakes to Avoid

❌ **Wrong:**
```
localhost:3000                    (missing protocol)
http://localhost:3000/            (trailing slash)
http://localhost:3000/auth        (missing /callback)
https://localhost:3000            (https on localhost - use http)
```

✅ **Correct:**
```
http://localhost:3000
http://localhost:3000/auth/callback
```

---

## Step-by-Step in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID (or create new one)
4. Under **"Authorized JavaScript origins"**:
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000`
   - Click **"+ ADD URI"** again for production URLs if needed

5. Under **"Authorized redirect URIs"**:
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000/auth/callback`
   - Click **"+ ADD URI"** again
   - Add: `https://your-project-ref.supabase.co/auth/v1/callback` (from Supabase)
   - Add production URLs if needed

6. Click **"SAVE"** at the bottom

---

## Why Both Are Needed

- **JavaScript Origins**: Where your app runs (frontend)
- **Redirect URIs**: Where Google sends users after authorization (callback endpoints)

For Supabase Auth, you need:
- Your app's origin (where users click "Sign in with Google")
- Supabase's callback URL (where Supabase receives the OAuth response)

---

## Testing

After adding these URLs:
1. Try signing in from `http://localhost:3000`
2. You should be redirected to Google's consent screen
3. After authorizing, you should be redirected back to your app

If you get "redirect_uri_mismatch" error, double-check:
- The redirect URI matches exactly (including protocol, domain, and path)
- No extra spaces or characters
- Case-sensitive matching

