# Fix: GA4 "fetch_properties_failed" Error

## The Problem
You're getting an error when trying to connect GA4:
```
Error: fetch_properties_failed
```

This happens when the app successfully gets OAuth tokens but fails to fetch your GA4 properties from the Analytics Admin API.

## Common Causes

### 1. Analytics Admin API Not Enabled
The Analytics Admin API must be enabled in your Google Cloud project.

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **"APIs & Services" → "Library"**
4. Search for **"Google Analytics Admin API"**
5. Click on it and click **"Enable"**
6. Wait a few minutes for it to activate
7. Try connecting again

### 2. No GA4 Properties
You don't have any GA4 properties in your Google Analytics account.

**Fix:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Make sure you have at least one GA4 property (not Universal Analytics)
3. If you only have Universal Analytics properties, you need to create a GA4 property first
4. Try connecting again

### 3. Insufficient Permissions
Your Google account doesn't have the right permissions to access the Analytics Admin API.

**Fix:**
1. Make sure you're signed in with a Google account that has access to GA4
2. The account needs at least "Viewer" permissions on the GA4 property
3. Try connecting again

### 4. Wrong OAuth Scopes
The OAuth scopes might not include the Analytics Admin API scope.

**Fix:**
1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Make sure these scopes are added:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
3. Save and try again

### 5. API Quota/Usage Limits
You might have hit API quota limits (unlikely for testing).

**Fix:**
1. Check your API usage in Google Cloud Console
2. Wait a few minutes and try again

## Step-by-Step Troubleshooting

1. **Check API is enabled:**
   - Go to Google Cloud Console → APIs & Services → Library
   - Search "Google Analytics Admin API"
   - Make sure it's enabled

2. **Check you have GA4 properties:**
   - Go to analytics.google.com
   - Check if you have GA4 properties (not just Universal Analytics)
   - GA4 properties show as "GA4" in the property list

3. **Check OAuth scopes:**
   - Go to OAuth consent screen
   - Verify Analytics scopes are added

4. **Try again:**
   - Clear browser cookies
   - Try connecting again

## Still Not Working?

Check the server logs for more detailed error messages. The callback route now logs more information that can help diagnose the issue.

