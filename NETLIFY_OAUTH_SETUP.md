# Setting Up OAuth for Netlify Deployment

After deploying to Netlify, you need to update the OAuth redirect URIs in both Google Cloud Console and Supabase to include your Netlify domain.

## Step 1: Get Your Netlify URL

After deploying, your site will have a URL like:
- `https://your-site-name.netlify.app`
- Or your custom domain if you set one up

**Note this URL - you'll need it for the next steps!**

---

## Step 2: Update Google Cloud Console

### 2.1 Go to Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**

### 2.2 Update OAuth 2.0 Client IDs

You likely have **TWO** OAuth clients:
1. **One for Supabase OAuth** (user login)
2. **One for GA4 API** (analytics access)

#### For Supabase OAuth Client:
1. Find your OAuth 2.0 Client ID (the one used for user authentication)
2. Click on it to edit
3. Under **"Authorized JavaScript origins"**, add:
   ```
   https://your-site-name.netlify.app
   ```
   (Keep `http://localhost:3000` for local development)

4. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-site-name.netlify.app/api/auth/callback
   ```
   (Keep `http://localhost:3000/api/auth/callback` for local development)

5. Click **"Save"**

#### For GA4 API Client:
1. Find your GA4 OAuth 2.0 Client ID
2. Click on it to edit
3. Under **"Authorized JavaScript origins"**, add:
   ```
   https://your-site-name.netlify.app
   ```
   (Keep `http://localhost:3000` for local development)

4. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-site-name.netlify.app/api/ga4/callback
   ```
   (Keep `http://localhost:3000/api/ga4/callback` for local development)

5. Click **"Save"**

---

## Step 3: Update Supabase Google OAuth Provider

### 3.1 Go to Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **"Authentication"** → **"Providers"**
4. Find **"Google"** and click on it

### 3.2 Update Redirect URLs
1. In the **"Redirect URLs"** section, you should see:
   ```
   http://localhost:3000/api/auth/callback
   ```

2. Add your Netlify URL:
   ```
   https://your-site-name.netlify.app/api/auth/callback
   ```

3. If you have a custom domain, also add:
   ```
   https://your-custom-domain.com/api/auth/callback
   ```

4. Click **"Save"**

### 3.3 Verify Google OAuth Settings
Make sure these are set correctly:
- **Enabled**: ✅ Toggle should be ON
- **Client ID (for OAuth)**: Your Google OAuth Client ID
- **Client Secret (for OAuth)**: Your Google OAuth Client Secret
- **Redirect URLs**: Should include both localhost and Netlify URLs

---

## Step 4: Update Netlify Environment Variables

In Netlify dashboard, update these environment variables:

### Update GA4 Redirect URI:
1. Go to Netlify → Your Site → **"Site configuration"** → **"Environment variables"**
2. Find `NEXT_PUBLIC_GA4_REDIRECT_URI`
3. Update the value to:
   ```
   https://your-site-name.netlify.app/api/ga4/callback
   ```
   (Replace `your-site-name.netlify.app` with your actual Netlify domain)

4. Click **"Save"**

### Update NEXTAUTH_URL (if you use it):
1. Find `NEXTAUTH_URL` (if it exists)
2. Update to:
   ```
   https://your-site-name.netlify.app
   ```

---

## Step 5: Redeploy on Netlify

After making these changes:
1. Go to Netlify dashboard
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
   - OR push a new commit to trigger automatic deployment

---

## Summary of URLs to Add

### Google Cloud Console - Supabase OAuth Client:
- **Authorized JavaScript origins**: `https://your-site.netlify.app`
- **Authorized redirect URIs**: `https://your-site.netlify.app/api/auth/callback`

### Google Cloud Console - GA4 API Client:
- **Authorized JavaScript origins**: `https://your-site.netlify.app`
- **Authorized redirect URIs**: `https://your-site.netlify.app/api/ga4/callback`

### Supabase Dashboard:
- **Redirect URLs**: `https://your-site.netlify.app/api/auth/callback`

### Netlify Environment Variables:
- `NEXT_PUBLIC_GA4_REDIRECT_URI`: `https://your-site.netlify.app/api/ga4/callback`
- `NEXTAUTH_URL`: `https://your-site.netlify.app` (if used)

---

## Testing

After making all changes:
1. Visit your Netlify site: `https://your-site.netlify.app`
2. Try to log in with Google
3. You should be redirected to Google for authentication
4. After approving, you should be redirected back to your Netlify site

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in your request doesn't match what's configured
- **Fix**: Double-check all redirect URIs are added correctly in Google Cloud Console

### Error: "OAuth callback error"
- **Cause**: Supabase doesn't have the correct redirect URL
- **Fix**: Add the Netlify URL to Supabase → Authentication → Providers → Google → Redirect URLs

### Login works locally but not on Netlify
- **Cause**: Environment variables or redirect URIs not updated
- **Fix**: 
  1. Check Netlify environment variables are set
  2. Verify redirect URIs include Netlify domain
  3. Redeploy the site

---

## Quick Checklist

- [ ] Added Netlify URL to Google Cloud Console (Supabase OAuth client)
- [ ] Added Netlify URL to Google Cloud Console (GA4 API client)
- [ ] Added Netlify URL to Supabase → Authentication → Providers → Google
- [ ] Updated `NEXT_PUBLIC_GA4_REDIRECT_URI` in Netlify environment variables
- [ ] Updated `NEXTAUTH_URL` in Netlify (if used)
- [ ] Redeployed site on Netlify
- [ ] Tested login on Netlify site

