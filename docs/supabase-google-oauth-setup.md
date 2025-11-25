# Step-by-Step Guide: Configure Google OAuth in Supabase

## Prerequisites: Google Cloud Console Setup

### Step 1.1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Analytics SaaS` (or your preferred name)
5. Click **"Create"**
6. Wait for project creation, then select it from the dropdown

### Step 1.2: Enable Required APIs
1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Analytics Data API"** and click on it
3. Click **"Enable"**
4. Go back to Library
5. Search for **"Google Analytics Admin API"** and click on it
6. Click **"Enable"**

### Step 1.3: Configure OAuth Consent Screen
1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: `Analytics SaaS` (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On **Scopes** page, click **"Add or Remove Scopes"**
7. Add these scopes:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
8. Click **"Update"**, then **"Save and Continue"**
9. On **Test users** page (if in testing), add your email as a test user
10. Click **"Save and Continue"** through remaining steps

### Step 1.4: Create OAuth 2.0 Credentials
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Give it a name: `Analytics SaaS Web Client`
6. Under **"Authorized JavaScript origins"**, click **"ADD URI"** and add:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production - add this later)
7. Under **"Authorized redirect URIs"**, click **"ADD URI"** and add:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-supabase-project.supabase.co/auth/v1/callback` (Supabase callback)
   - `https://your-domain.com/auth/callback` (for production - add this later)
8. Click **"Create"**
9. **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately
   - You'll see a popup with these values
   - Save them securely - you won't be able to see the secret again!

---

## Step 2: Configure Google OAuth in Supabase

### Step 2.1: Access Supabase Authentication Settings
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one if you haven't)
3. In the left sidebar, click **"Authentication"**
4. Click on **"Providers"** tab

### Step 2.2: Enable Google Provider
1. Scroll down to find **"Google"** in the providers list
2. Toggle the **"Enable Google provider"** switch to ON

### Step 2.3: Enter Google OAuth Credentials
1. In the **"Client ID (for OAuth)"** field, paste your Google Client ID
2. In the **"Client Secret (for OAuth)"** field, paste your Google Client Secret
3. The **"Authorized Client IDs"** field can be left empty (optional)

### Step 2.4: Configure Redirect URL
1. Scroll down to see the **"Redirect URL"** section
2. Copy the redirect URL shown (it will look like):
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
3. **IMPORTANT**: Go back to Google Cloud Console
4. In your OAuth 2.0 credentials, add this Supabase redirect URL to **"Authorized redirect URIs"**
5. Click **"Save"** in Google Cloud Console

### Step 2.5: Save Supabase Configuration
1. Go back to Supabase
2. Scroll to the bottom of the Google provider settings
3. Click **"Save"** button
4. You should see a success message

### Step 2.6: Test the Configuration
1. In Supabase, go to **"Authentication" > "Users"**
2. Try signing in with Google from your application
3. You should be redirected to Google's consent screen
4. After authorizing, you should be redirected back and logged in

---

## Step 3: Update Environment Variables

After configuring, make sure your `.env.local` file has:

```bash
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Supabase (from Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution**: Make sure the Supabase redirect URL is added to Google Cloud Console's authorized redirect URIs exactly as shown in Supabase.

### Issue: "Invalid client"
**Solution**: Double-check that you copied the Client ID and Client Secret correctly (no extra spaces).

### Issue: "Access blocked: This app's request is invalid"
**Solution**: 
- Make sure OAuth consent screen is configured
- If in testing mode, add your email as a test user
- Verify all required scopes are added

### Issue: "Error 400: redirect_uri_mismatch"
**Solution**: The redirect URI in your app must match exactly what's in Google Cloud Console. Check:
- No trailing slashes
- Exact protocol (http vs https)
- Exact domain and path

---

## Security Notes

1. **Never commit** `.env.local` to version control
2. **Client Secret** should only be used server-side (Supabase handles this)
3. For production, update redirect URIs to your production domain
4. Consider restricting OAuth consent screen to specific domains in production

---

## Next Steps

After completing this setup:
1. Test authentication in your app
2. Verify user profiles are created in Supabase
3. Set up your first admin user (manually update role in database)
4. Run the default templates seed script

