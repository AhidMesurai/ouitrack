-- Default Report Templates (Fixed Version)
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID from Supabase
-- 
-- To get your User ID:
-- 1. Sign in to your app at http://localhost:3000
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Copy your User ID (UUID)
-- 4. Replace 'YOUR_USER_ID_HERE' below with that UUID

-- Set your user ID here (replace the UUID)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Try to get the first user from auth.users
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  -- If no user found, you'll need to manually set it
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in auth.users. Please sign in first, then replace YOUR_USER_ID_HERE with your actual user ID.';
  END IF;

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
    v_user_id,
    true
  );

  -- 2. Traffic Sources Analysis
  INSERT INTO report_templates (name, description, template_config, created_by, is_active)
  VALUES (
    'Traffic Sources Analysis',
    'Analyze where your traffic is coming from with detailed source and medium breakdowns.',
    '{
      "metrics": [
        {"name": "sessions", "label": "Total Sessions", "format": "number"},
        {"name": "users", "label": "Users", "format": "number"}
      ],
      "charts": [
        {
          "type": "bar",
          "title": "Sessions by Source/Medium",
          "metrics": ["sessions"],
          "dimensions": ["source", "medium"]
        },
        {
          "type": "pie",
          "title": "Organic vs Paid Traffic",
          "metrics": ["sessions"],
          "dimensions": ["medium"]
        },
        {
          "type": "table",
          "title": "Top Referral Sources",
          "metrics": ["sessions", "users"],
          "dimensions": ["source"]
        }
      ],
      "timeframe": "last_30_days"
    }'::jsonb,
    v_user_id,
    true
  );

  -- 3. Content Performance Report
  INSERT INTO report_templates (name, description, template_config, created_by, is_active)
  VALUES (
    'Content Performance Report',
    'See which pages and content are performing best on your website.',
    '{
      "metrics": [
        {"name": "pageviews", "label": "Total Pageviews", "format": "number"},
        {"name": "users", "label": "Users", "format": "number"}
      ],
      "charts": [
        {
          "type": "line",
          "title": "Page Views Over Time",
          "metrics": ["pageviews"],
          "dimensions": ["date"]
        },
        {
          "type": "table",
          "title": "Top Performing Pages",
          "metrics": ["pageviews", "users"],
          "dimensions": ["pagePath"]
        }
      ],
      "timeframe": "last_30_days"
    }'::jsonb,
    v_user_id,
    true
  );

  -- 4. Mobile vs Desktop Analysis
  INSERT INTO report_templates (name, description, template_config, created_by, is_active)
  VALUES (
    'Mobile vs Desktop Analysis',
    'Compare performance across different device types and screen sizes.',
    '{
      "metrics": [
        {"name": "sessions", "label": "Total Sessions", "format": "number"},
        {"name": "users", "label": "Users", "format": "number"}
      ],
      "charts": [
        {
          "type": "pie",
          "title": "Sessions by Device Type",
          "metrics": ["sessions"],
          "dimensions": ["deviceCategory"]
        },
        {
          "type": "table",
          "title": "Device Performance Comparison",
          "metrics": ["sessions", "users", "bounceRate"],
          "dimensions": ["deviceCategory"]
        }
      ],
      "timeframe": "last_30_days"
    }'::jsonb,
    v_user_id,
    true
  );

  -- 5. Monthly Executive Summary
  INSERT INTO report_templates (name, description, template_config, created_by, is_active)
  VALUES (
    'Monthly Executive Summary',
    'High-level overview of key metrics and insights for executive reporting.',
    '{
      "metrics": [
        {"name": "sessions", "label": "Total Sessions", "format": "number"},
        {"name": "users", "label": "Total Users", "format": "number"},
        {"name": "newUsers", "label": "New Users", "format": "number"},
        {"name": "bounceRate", "label": "Bounce Rate", "format": "percentage"},
        {"name": "sessionDuration", "label": "Avg Session Duration", "format": "duration"}
      ],
      "charts": [
        {
          "type": "line",
          "title": "Key Metrics Trend",
          "metrics": ["sessions", "users"],
          "dimensions": ["date"]
        }
      ],
      "timeframe": "last_30_days"
    }'::jsonb,
    v_user_id,
    true
  );

  RAISE NOTICE 'Successfully created 5 report templates for user: %', v_user_id;
END $$;

