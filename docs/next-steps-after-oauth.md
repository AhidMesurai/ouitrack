# Next Steps After Google OAuth Configuration

## ✅ What You've Completed
- [x] Google Cloud Console setup
- [x] Google OAuth credentials created
- [x] Supabase Google OAuth provider configured
- [x] Redirect URIs added to Google Cloud Console

---

## Step 1: Set Up Database Schema

### 1.1 Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. In the left sidebar, click **"SQL Editor"**
4. Click **"New query"**

### 1.2 Run the Migration
1. Open the file: `supabase/migrations/001_initial_schema.sql`
2. Copy **ALL** the contents of that file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
5. You should see a success message: "Success. No rows returned"

### 1.3 Verify Tables Were Created
1. In Supabase Dashboard, go to **"Table Editor"** (left sidebar)
2. You should see these tables:
   - `user_profiles`
   - `ga4_connections`
   - `report_templates`
   - `generated_reports`

✅ **Checkpoint**: Database tables created successfully

---

## Step 2: Get Supabase Credentials

### 2.1 Get Project URL and Keys
1. In Supabase Dashboard, go to **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (long string - keep this secret!)

### 2.2 Copy These Values
- Copy the **Project URL**
- Copy the **anon public** key
- Copy the **service_role** key (you'll need this later)

✅ **Checkpoint**: Supabase credentials copied

---

## Step 3: Set Up Environment Variables

### 3.1 Create .env.local File
1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example` (if it exists) or create new

### 3.2 Add Your Credentials
Open `.env.local` and add:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uhbtmofnemtwlorxyzxc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google OAuth & Analytics API
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_ANALYTICS_API_KEY=your_analytics_api_key_here

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here

# Other
NODE_ENV=development
```

### 3.3 Fill in the Values
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (from Step 2.1)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key (from Step 2.1)
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from Step 2.1)
- `GOOGLE_CLIENT_ID`: Your Google Client ID (from Google Cloud Console)
- `GOOGLE_CLIENT_SECRET`: Your Google Client Secret (from Google Cloud Console)
- `GOOGLE_ANALYTICS_API_KEY`: (Optional for now - you can add this later)
- `NEXTAUTH_SECRET`: Generate a random string (you can use: `openssl rand -base64 32`)

### 3.4 Generate NEXTAUTH_SECRET (Optional but Recommended)
Run this command in your terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as `NEXTAUTH_SECRET`

✅ **Checkpoint**: Environment variables configured

---

## Step 4: Install Dependencies

### 4.1 Install npm Packages
Open terminal in your project root and run:

```bash
npm install
```

This will install all the dependencies listed in `package.json`.

**Note**: If you get prompted to install packages, type `y` and press Enter.

### 4.2 Verify Installation
Wait for installation to complete. You should see:
```
added XXX packages, and audited XXX packages in XXs
```

✅ **Checkpoint**: Dependencies installed

---

## Step 5: Start Development Server

### 5.1 Run the Dev Server
```bash
npm run dev
```

### 5.2 Verify Server Started
You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.XXs
```

### 5.3 Open in Browser
Open [http://localhost:3000](http://localhost:3000) in your browser

✅ **Checkpoint**: Development server running

---

## Step 6: Test Authentication

### 6.1 Test Sign In
1. On the landing page, click **"Sign In"** (top right) or **"Start Free Trial"**
2. You should be redirected to the login page
3. Click **"Sign in with Google"**
4. You should be redirected to Google's consent screen
5. Select your Google account and authorize
6. You should be redirected back to your app's dashboard

### 6.2 Verify User Created
1. Go to Supabase Dashboard
2. Navigate to **"Authentication" → "Users"**
3. You should see your user account listed
4. Go to **"Table Editor" → "user_profiles"**
5. You should see a row with your user ID and role = 'client'

✅ **Checkpoint**: Authentication working, user profile created

---

## Step 7: Create Your First Admin User

### 7.1 Get Your User ID
1. In Supabase Dashboard, go to **"Authentication" → "Users"**
2. Find your user (by email)
3. Click on the user to see details
4. Copy the **UUID** (User ID) - it looks like: `123e4567-e89b-12d3-a456-426614174000`

### 7.2 Update User Role to Admin
1. Go to **"SQL Editor"** in Supabase
2. Run this query (replace `YOUR_USER_ID` with your actual UUID):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'YOUR_USER_ID';
```

3. Click **"Run"**
4. You should see: "Success. 1 row updated"

### 7.3 Verify Admin Role
1. Go to **"Table Editor" → "user_profiles"**
2. Find your user
3. The `role` column should now show `admin`

✅ **Checkpoint**: Admin user created

---

## Step 8: Seed Default Report Templates

### 8.1 Get Your Admin User ID
If you don't have it, get it from Step 7.1

### 8.2 Update the Seed Script
1. Open `scripts/seed-default-templates.sql`
2. Find the line that says: `(SELECT id FROM auth.users LIMIT 1)`
3. This should work automatically, but if it doesn't, replace it with your actual user ID:

```sql
-- Replace this line in the seed script:
created_by: (SELECT id FROM auth.users LIMIT 1)

-- With your actual user ID (if needed):
created_by: 'YOUR_USER_ID_HERE'
```

### 8.3 Run the Seed Script
1. Go to Supabase **"SQL Editor"**
2. Open `scripts/seed-default-templates.sql`
3. Copy ALL the contents
4. Paste into SQL Editor
5. Click **"Run"**
6. You should see: "Success. No rows returned" or success messages

### 8.4 Verify Templates Created
1. Go to **"Table Editor" → "report_templates"**
2. You should see 5 templates:
   - Website Performance Overview
   - Traffic Sources Analysis
   - Content Performance Report
   - Mobile vs Desktop Analysis
   - Monthly Executive Summary

✅ **Checkpoint**: Default templates created

---

## Step 9: Test the Dashboard

### 9.1 Sign Out and Sign Back In
1. In your app, go to **Dashboard → Settings**
2. Click **"Sign Out"**
3. Sign back in with Google
4. You should see the dashboard with:
   - Connection status (no GA4 connected yet)
   - Available reports (the 5 default templates)

### 9.2 Test Admin Panel
1. In the sidebar, you should now see an **"Admin"** section
2. Click on **"Users"** - you should see user management
3. Click on **"Templates"** - you should see template management

✅ **Checkpoint**: Dashboard and admin panel accessible

---

## Step 10: Next Steps (Optional)

### 10.1 Connect GA4 Account
- Go to Dashboard → Connect GA4
- This will require additional Google OAuth setup for GA4 access
- (We'll cover this in a separate guide)

### 10.2 Test Report Generation
- Click on any report template
- You'll need a GA4 connection first to see actual data

### 10.3 Customize Templates
- As admin, go to Admin → Templates
- You can create and edit report templates

---

## Troubleshooting

### Issue: "Invalid API key" error
**Solution**: Double-check your `.env.local` file - make sure keys are correct and there are no extra spaces

### Issue: "User profile not created"
**Solution**: Check if the database migration ran successfully. The `user_profiles` table should exist.

### Issue: "Cannot access admin panel"
**Solution**: Make sure you updated your user role to 'admin' in Step 7

### Issue: "No templates showing"
**Solution**: Make sure you ran the seed script in Step 8

### Issue: "Redirect URI mismatch"
**Solution**: Double-check that the Supabase redirect URI is added to Google Cloud Console

---

## ✅ Completion Checklist

- [ ] Database schema created
- [ ] Supabase credentials obtained
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Authentication tested
- [ ] Admin user created
- [ ] Default templates seeded
- [ ] Dashboard accessible
- [ ] Admin panel accessible

---

## What's Next?

Once all checkpoints are complete, you can:
1. Connect your first GA4 account
2. Generate your first report
3. Customize report templates
4. Add more users
5. Deploy to production

Need help with any step? Check the troubleshooting section or refer to `memory.md` for detailed documentation.

