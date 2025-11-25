# Create User Profile Manually

## The Issue
Your user exists in `auth.users` but not in `user_profiles` table. This happens because the profile is auto-created when you first access the profile API, but it hasn't been triggered yet.

## Solution: Create Profile Manually

### Step 1: Get Your User ID
You already have it: `671f4e55-c9ba-4294-82c4-f5b6ff3c4778`

### Step 2: Create the Profile
Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
INSERT INTO user_profiles (id, role, created_at, updated_at)
VALUES (
  '671f4e55-c9ba-4294-82c4-f5b6ff3c4778',
  'admin',
  NOW(),
  NOW()
);
```

### Step 3: Verify
1. Go to **Table Editor** → **user_profiles**
2. You should see your user with role = 'admin'

---

## Alternative: Trigger Profile Creation via API

You can also trigger profile creation by accessing the profile API:

1. Sign in to your app
2. The profile should be auto-created when the dashboard loads
3. If not, you can manually call the API endpoint

But the SQL method above is faster and more reliable.

