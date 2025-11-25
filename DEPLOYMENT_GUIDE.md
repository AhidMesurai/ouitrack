# Deployment Guide: GitHub + Netlify

This guide will walk you through publishing your project to GitHub and deploying it to Netlify.

## Prerequisites
- Git installed on your computer
- GitHub account (create one at https://github.com)
- Netlify account (create one at https://netlify.com)

---

## Part 1: Publishing to GitHub

### Step 1: Initialize Git (if not already done)
Open your terminal/command prompt in the project directory and run:

```bash
# Check if git is already initialized
git status

# If you get an error, initialize git:
git init
```

### Step 2: Stage All Files
```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

### Step 3: Create Initial Commit
```bash
git commit -m "Initial commit: OuiTrack landing page"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `ouitrack` (or your preferred name)
   - **Description**: "Analytics dashboard landing page"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 5: Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ouitrack.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token if 2FA is enabled).

---

## Part 2: Deploying to Netlify

### Step 6: Create Netlify Account
1. Go to https://netlify.com
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (recommended for easier integration)
4. Authorize Netlify to access your GitHub account

### Step 7: Deploy from GitHub
1. In Netlify dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify if prompted
5. Select your repository: `ouitrack` (or whatever you named it)

### Step 8: Configure Build Settings
Netlify should auto-detect Next.js, but verify these settings:

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**OR** if using static export, you'll need to update `next.config.js` first (see Step 9).

### Step 9: Configure Next.js for Netlify (if needed)
For Next.js on Netlify, you have two options:

#### Option A: Next.js Runtime (Recommended)
Netlify supports Next.js natively. The build settings should be:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18.x` or `20.x` (set in Netlify settings)

#### Option B: Static Export
If you want a static site, update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

Then set:
- **Build command**: `npm run build`
- **Publish directory**: `out`

### Step 10: Set Environment Variables (if needed)
If your app uses environment variables:

1. In Netlify dashboard, go to your site
2. Click **"Site configuration"** → **"Environment variables"**
3. Click **"Add variable"**
4. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL` (example)
   - **Value**: Your actual value
5. Click **"Save"**

**Important**: Only add variables that start with `NEXT_PUBLIC_` for client-side access.

### Step 11: Deploy
1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://random-name-123.netlify.app`

### Step 12: Custom Domain (Optional)
1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions

---

## Part 3: Continuous Deployment

### Automatic Deployments
Once connected, Netlify will automatically:
- Deploy when you push to the `main` branch
- Create preview deployments for pull requests
- Rebuild on every commit

### Manual Deploy
To trigger a manual deploy:
1. Go to **"Deploys"** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## Troubleshooting

### Build Fails
1. Check the build logs in Netlify dashboard
2. Common issues:
   - Missing environment variables
   - Node version mismatch (set Node version in Netlify)
   - Build timeout (increase in site settings)

### Environment Variables Not Working
- Make sure they start with `NEXT_PUBLIC_` for client-side
- Redeploy after adding variables
- Check for typos in variable names

### Git Push Issues
```bash
# If you get authentication errors, use a Personal Access Token:
# 1. GitHub → Settings → Developer settings → Personal access tokens
# 2. Generate new token with 'repo' permissions
# 3. Use token as password when pushing
```

---

## Quick Reference Commands

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Check remote repository
git remote -v
```

---

## Next Steps After Deployment

1. **Test your live site** - Make sure everything works
2. **Set up custom domain** - Use your own domain name
3. **Enable HTTPS** - Netlify does this automatically
4. **Monitor deployments** - Check Netlify dashboard regularly
5. **Set up analytics** - Add Netlify Analytics if needed

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Docs**: https://docs.github.com

