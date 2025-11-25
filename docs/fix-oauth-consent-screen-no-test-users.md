# Fix: No "Test Users" Section in OAuth Consent Screen

## The Problem
You don't see a "Test users" section in your OAuth consent screen settings.

## Why This Happens
This usually means your OAuth consent screen is set to "Internal" instead of "External". Internal apps are only for Google Workspace organizations and don't have test users.

## Solution: Change to External App

### Step 1: Check Your App Type
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **"APIs & Services" → "OAuth consent screen"**
4. Look at the top - it should say either:
   - **"Internal"** - Only for your Google Workspace organization
   - **"External"** - Available to any Google account

### Step 2: Change to External (if needed)
If it says "Internal":

1. **You may need to change it to External:**
   - Click **"EDIT APP"** button
   - At the top, you should see the app type
   - If it's set to "Internal", you'll need to change it to "External"
   - **Note**: If you're using a personal Google account (not Google Workspace), you MUST use "External"

2. **If you can't change it:**
   - This might be because you're using a Google Workspace account
   - In that case, "Internal" is fine - all users in your organization can access it
   - But if you want external users, you need to use a personal Google account or change the setting

### Step 3: For External Apps - Add Test Users
Once your app is set to "External":

1. Scroll down to find the **"Test users"** section
2. Click **"+ ADD USERS"**
3. Add your email address
4. Click **"SAVE"**

### Step 4: For Internal Apps (Google Workspace)
If your app is "Internal":
- All users in your Google Workspace organization can access it
- You don't need to add test users
- But make sure you're signing in with an account from the same organization

---

## Alternative: Publish Your App

If you want to allow anyone to sign in (not just test users):

1. Complete all required fields in OAuth consent screen:
   - App name
   - User support email
   - Developer contact information
   - Scopes
   - **Privacy Policy URL** (required for sensitive scopes)
   - **Terms of Service URL** (required for sensitive scopes)

2. Click **"PUBLISH APP"** button at the top
3. Confirm the action

**Note**: Publishing may require verification for sensitive scopes like Analytics.

---

## Quick Checklist

- [ ] Check if app type is "Internal" or "External"
- [ ] If "Internal" and you want external users → Change to "External" (or use personal Google account)
- [ ] If "External" → Scroll down to find "Test users" section
- [ ] Add your email as a test user
- [ ] Save changes
- [ ] Try signing in again

---

## Still Can't Find It?

If you still don't see the "Test users" section:

1. **Take a screenshot** of your OAuth consent screen
2. Check what it says at the top (Internal/External)
3. Make sure you're looking at the right project
4. Try refreshing the page

Let me know what you see and I can help further!

