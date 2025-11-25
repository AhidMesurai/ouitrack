# Next Steps After Authentication is Working

## ✅ What You've Completed
- [x] Project setup
- [x] Database schema created
- [x] Google OAuth configured
- [x] Authentication working (you can sign in!)

## Step 1: Create Your Admin User Profile

### 1.1 Get Your User ID
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user (by email: ahid.manja@gmail.com)
3. Click on your user to see details
4. **Copy the UUID** (User ID) - it looks like: `123e4567-e89b-12d3-a456-426614174000`

### 1.2 Update Your Role to Admin
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query (replace `YOUR_USER_ID` with your actual UUID):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'YOUR_USER_ID';
```

3. Click **"Run"**
4. You should see: "Success. 1 row updated"

### 1.3 Verify Admin Role
1. Go to **Supabase Dashboard** → **Table Editor** → **user_profiles**
2. Find your user
3. The `role` column should now show `admin`

---

## Step 2: Seed Default Report Templates

### 2.1 Run the Seed Script
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `scripts/seed-default-templates-fixed.sql`
3. Copy **ALL** the contents
4. Paste into SQL Editor
5. Click **"Run"**
6. You should see: "Success. No rows returned" or success messages

### 2.2 Verify Templates Created
1. Go to **Supabase Dashboard** → **Table Editor** → **report_templates**
2. You should see 5 templates:
   - Website Performance Overview
   - Traffic Sources Analysis
   - Content Performance Report
   - Mobile vs Desktop Analysis
   - Monthly Executive Summary

---

## Step 3: Test Your Dashboard

### 3.1 Sign Out and Sign Back In
1. In your app, go to **Dashboard** → **Settings**
2. Click **"Sign Out"**
3. Sign back in with Google
4. You should now see:
   - Dashboard with your email
   - Connection status section
   - Available reports section (5 templates)

### 3.2 Test Admin Panel
1. In the sidebar, you should now see an **"Admin"** section
2. Click on **"Users"** - you should see user management
3. Click on **"Templates"** - you should see template management

---

## Step 4: Connect Your First GA4 Account (Optional for Now)

This requires additional Google OAuth setup for GA4 access. We'll cover this in a separate guide.

For now, you can:
- View the dashboard
- See available report templates
- Test the admin panel
- Explore the UI

---

## Step 5: What's Next?

### Immediate Next Steps:
1. ✅ Create admin user (Step 1)
2. ✅ Seed default templates (Step 2)
3. ✅ Test dashboard (Step 3)
4. 🔄 Connect GA4 account (when ready)
5. 🔄 Generate first report (after GA4 connection)

### Future Enhancements:
- Connect GA4 accounts
- Generate reports with real data
- Customize report templates
- Add more users
- Deploy to production

---

## Quick Commands

```bash
# If you need to restart the dev server
npm run dev

# Check if everything is working
# Visit: http://localhost:3000
```

---

## Troubleshooting

### Issue: Can't see admin panel
**Solution**: Make sure you updated your user role to 'admin' in Step 1

### Issue: No templates showing
**Solution**: Make sure you ran the seed script in Step 2

### Issue: Dashboard shows "No data available"
**Solution**: This is normal - you need to connect a GA4 account first

---

## Success Checklist

- [ ] Admin user created
- [ ] Default templates seeded
- [ ] Dashboard accessible
- [ ] Admin panel visible
- [ ] Can view report templates
- [ ] Ready to connect GA4 (next step)

