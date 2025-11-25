# Fix: Next.js SWC Binary Error on Windows

## The Problem
```
⚠ Attempted to load @next/swc-win32-x64-msvc, but an error occurred
⨯ Failed to load SWC binary for win32/x64
```

This is a common Windows issue with corrupted or mismatched Next.js dependencies.

## Solution: Clean Reinstall

### Step 1: Stop the Dev Server
Press `Ctrl + C` in your terminal to stop the server.

### Step 2: Delete node_modules and Lock Files
```powershell
# Delete node_modules folder
Remove-Item -Recurse -Force node_modules

# Delete package-lock.json (if it exists)
Remove-Item -Force package-lock.json
```

### Step 3: Clear npm Cache
```powershell
npm cache clean --force
```

### Step 4: Reinstall Dependencies
```powershell
npm install
```

### Step 5: Try Running Again
```powershell
npm run dev
```

## Alternative: Use Yarn (If npm doesn't work)

If the above doesn't work, try using Yarn:

```powershell
# Install Yarn globally (if not installed)
npm install -g yarn

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Install with Yarn
yarn install

# Run dev server
yarn dev
```

## Alternative: Use pnpm (Another option)

```powershell
# Install pnpm globally
npm install -g pnpm

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Install with pnpm
pnpm install

# Run dev server
pnpm dev
```

## If Still Not Working

### Check Node.js Version
Make sure you're using a compatible Node.js version:
```powershell
node --version
```

Next.js 14 requires Node.js 18.17 or later. If you have an older version:
1. Download Node.js 18+ from [nodejs.org](https://nodejs.org)
2. Install it
3. Restart your terminal
4. Try again

### Manual Fix: Reinstall Next.js
```powershell
npm uninstall next
npm install next@latest
```

## Quick One-Liner Fix

Run this in PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue; npm cache clean --force; npm install
```

Then:
```powershell
npm run dev
```

