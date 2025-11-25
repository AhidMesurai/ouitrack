# GA4 Connection Setup Guide

## Overview
Connecting to GA4 requires a separate OAuth flow from user authentication. This allows your app to access Google Analytics data on behalf of users.

## Prerequisites

### 1. Google Cloud Console Setup

#### Step 1.1: Enable Required APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (the same one used for user OAuth)
3. Go to **"APIs & Services" > "Library"**
4. Enable these APIs:
   - ✅ **Google Analytics Data API v1**
   - ✅ **Google Analytics Admin API v1**

#### Step 1.2: Configure OAuth Consent Screen (if not done)
1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Make sure these scopes are added:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
3. **IMPORTANT: Add Test Users**
   - Scroll down to **"Test users"** section
   - Click **"+ ADD USERS"**
   - Add your Google account email (the one you'll use to sign in)
   - Add any other emails that need access
   - **This is required for testing mode!**

#### Step 1.3: Create OAuth 2.0 Credentials for GA4
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name: `GA4 API Client` (or similar)
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/ga4/callback
   ```
7. Click **"Create"**
8. **Copy the Client ID and Client Secret** - you'll need these!

---

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# GA4 OAuth Credentials (separate from Supabase OAuth)
NEXT_PUBLIC_GA4_CLIENT_ID=your_ga4_client_id_here
GA4_CLIENT_SECRET=your_ga4_client_secret_here

# GA4 OAuth Redirect (should match what you set in Google Cloud)
NEXT_PUBLIC_GA4_REDIRECT_URI=http://localhost:3000/api/ga4/callback
```

**Important**: These are DIFFERENT from the Supabase OAuth credentials!

---

## Step 3: How GA4 Connection Works

1. User clicks "Connect with Google Analytics" button
2. User is redirected to Google OAuth consent screen
3. User authorizes access to their GA4 data
4. Google redirects back with an authorization code
5. Your app exchanges the code for access/refresh tokens
6. Tokens are stored in the `ga4_connections` table
7. Your app can now fetch GA4 data using these tokens

---

## Step 4: Test the Connection

1. Go to your dashboard: http://localhost:3000/dashboard
2. Click **"Connect GA4"** in the sidebar (or go to `/dashboard/connect-ga4`)
3. Click **"Connect with Google Analytics"** button
4. You'll be redirected to Google's consent screen
5. Select your Google account
6. Authorize access to Analytics
7. You'll be redirected back to your app
8. Your GA4 properties should now be listed

---

## Step 5: Verify Connection

1. Go to **Supabase Dashboard** → **Table Editor** → **ga4_connections**
2. You should see a row with:
   - Your user ID
   - Property ID
   - Access token (encrypted)
   - Refresh token (encrypted)
   - Connected date

---

## Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution**: Make sure the redirect URI in Google Cloud Console exactly matches:
```
http://localhost:3000/api/ga4/callback
```

### Issue: "Access denied" or "Invalid scope"
**Solution**: 
1. Check that Analytics scopes are added to OAuth consent screen
2. Make sure APIs are enabled
3. Try revoking access and reconnecting

### Issue: "No properties found"
**Solution**:
1. Make sure you have access to at least one GA4 property
2. Check that the property is a GA4 property (not Universal Analytics)
3. Verify you have Viewer or Editor permissions

---

## Next Steps After Connection

Once connected, you can:
- View your GA4 properties in the dashboard
- Generate reports using real GA4 data
- Export reports to PDF
- Schedule reports (future feature)

---

## Security Notes

- Access tokens expire after 1 hour
- Refresh tokens are used to get new access tokens automatically
- Tokens are stored encrypted in the database
- Users can disconnect at any time
- Only the user who connected can access their GA4 data

