# Fix: Google OAuth 403 access_denied Error

## The Problem
You're getting this error:
```
Error 403: access_denied
OuiTrack has not completed Google's verification process. The app is in testing mode and only testers approved by the developer have access.
```

## Solution: Add Yourself as a Test User

### Step 1: Go to Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **"APIs & Services" → "OAuth consent screen"**

### Step 2: Add Test Users
1. Scroll down to the **"Test users"** section
2. Click **"+ ADD USERS"**
3. Enter your Google account email address (the one you're using to sign in)
4. Click **"ADD"**
5. You can add multiple test users if needed

### Step 3: Try Again
1. Go back to your app
2. Try signing in with Google again
3. The error should be resolved

---

## Alternative: Publish Your App (For Production)

If you want to allow anyone to sign in (not just test users), you need to publish your app:

### Requirements:
1. **OAuth consent screen must be complete:**
   - App name, logo, support email
   - Scopes defined
   - Privacy policy URL (required for sensitive scopes)
   - Terms of service URL (required for sensitive scopes)

2. **For sensitive scopes** (like Analytics):
   - You may need to submit for verification
   - This can take several days/weeks
   - Google reviews your app

### Steps to Publish:
1. Go to **"OAuth consent screen"**
2. Make sure all required fields are filled
3. Click **"PUBLISH APP"** button
4. Confirm the action

**Note**: For development/testing, it's easier to just add test users rather than publishing.

---

## Quick Fix Summary

**For Development:**
1. Add your email as a test user in OAuth consent screen
2. Try signing in again

**For Production:**
1. Complete OAuth consent screen
2. Add Privacy Policy and Terms of Service URLs
3. Publish the app (may require verification for sensitive scopes)

---

## Common Issues

### Issue: "Can't add test users"
**Solution**: Make sure your OAuth consent screen is set to "External" (not "Internal" which requires Google Workspace)

### Issue: "Still getting 403 after adding test user"
**Solution**: 
- Make sure you're using the exact email address you added
- Wait a few minutes for changes to propagate
- Clear browser cookies and try again

