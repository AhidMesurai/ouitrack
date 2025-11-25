# Fix: Seed Script Error - created_by is null

## The Problem
You're getting this error:
```
ERROR: 23502: null value in column "created_by" violates not-null constraint
```

This happens because the seed script can't find a user in `auth.users` table.

## Solution: Sign In First, Then Run Seed Script

### Step 1: Sign In to Create Your User
1. Make sure your app is running: `npm run dev`
2. Open http://localhost:3000
3. Click **"Sign In"** → **"Sign in with Google"**
4. Complete the Google OAuth flow
5. You should be redirected to the dashboard

### Step 2: Get Your User ID
1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. You should see your user listed (by email)
4. Click on your user to see details
5. **Copy the UUID** (User ID) - it looks like: `ed2b704d-537f-4e0e-9399-aedeb95dd1e8`

### Step 3: Use the Fixed Seed Script

I've created a fixed version: `scripts/seed-default-templates-fixed.sql`

This version will:
- Automatically find your user ID if you've signed in
- Give you a clear error if no user is found

### Option A: Use the Auto-Detection Version (Recommended)
1. Open `scripts/seed-default-templates-fixed.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. It should automatically find your user and create the templates

### Option B: Manual Version (If Auto-Detection Fails)
If the auto-detection doesn't work, use this version with your actual User ID:

```sql
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID from Step 2

-- 1. Website Performance Overview
INSERT INTO report_templates (name, description, template_config, created_by, is_active)
VALUES (
  'Website Performance Overview',
  'Comprehensive overview of website performance metrics including sessions, users, bounce rate, and top pages.',
  '{
    "metrics": [
      {"name": "sessions", "label": "Total Sessions", "format": "number"},
      {"name": "users", "label": "Total Users", "format": "number"},
      {"name": "newUsers", "label": "New Users", "format": "number"},
      {"name": "bounceRate", "label": "Bounce Rate", "format": "percentage"}
    ],
    "charts": [
      {
        "type": "line",
        "title": "Sessions Over Time",
        "metrics": ["sessions"],
        "dimensions": ["date"]
      },
      {
        "type": "bar",
        "title": "Top Pages",
        "metrics": ["pageviews"],
        "dimensions": ["pagePath"]
      },
      {
        "type": "pie",
        "title": "Device Breakdown",
        "metrics": ["sessions"],
        "dimensions": ["deviceCategory"]
      }
    ],
    "timeframe": "last_30_days"
  }'::jsonb,
  'YOUR_USER_ID_HERE',  -- Replace this with your actual UUID
  true
);

-- Repeat for other 4 templates, replacing 'YOUR_USER_ID_HERE' in each
```

## Quick Fix Steps

1. **Sign in to your app** (creates user in auth.users)
2. **Get your User ID** from Supabase → Authentication → Users
3. **Run the fixed seed script**: `scripts/seed-default-templates-fixed.sql`

## Verify It Worked

After running the script:
1. Go to **Supabase Dashboard** → **Table Editor** → **report_templates**
2. You should see 5 templates:
   - Website Performance Overview
   - Traffic Sources Analysis
   - Content Performance Report
   - Mobile vs Desktop Analysis
   - Monthly Executive Summary

## Still Having Issues?

If you still get errors:
1. Make sure you've signed in at least once
2. Check that your user exists in Supabase → Authentication → Users
3. Verify the User ID is a valid UUID format
4. Try the manual version with your exact User ID

