# Seed Default Report Templates

## Step 1: Run the Seed Script

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `scripts/seed-default-templates-fixed.sql`
3. Copy **ALL** the contents (the entire file)
4. Paste into Supabase SQL Editor
5. Click **"Run"**
6. You should see: "Success. No rows returned" or success messages

## Step 2: Verify Templates

1. Go to **Supabase Dashboard** → **Table Editor** → **report_templates**
2. You should see 5 templates:
   - Website Performance Overview
   - Traffic Sources Analysis
   - Content Performance Report
   - Mobile vs Desktop Analysis
   - Monthly Executive Summary

## Step 3: View in Your App

1. Go to your dashboard: http://localhost:3000/dashboard
2. Scroll down to "Available Reports" section
3. You should see 5 report cards displayed

## If Templates Don't Show

- Make sure you ran the seed script successfully
- Check that templates have `is_active = true`
- Refresh your dashboard page
- Check browser console for any errors

