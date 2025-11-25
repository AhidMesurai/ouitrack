# Debug OAuth Flow

## Check What's Happening

### Step 1: Check Browser Console
1. Open your app in browser
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Click "Sign in with Google"
5. Look for the log message: `OAuth redirect URL: ...`
6. **Tell me what URL it shows**

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Click "Sign in with Google"
3. Look for the first redirect
4. **What URL does it redirect to?**
   - Should be: `https://xxxxx.supabase.co/auth/v1/authorize?...`
   - If it's: `https://accounts.google.com/...` directly, that's the problem

### Step 3: Verify Supabase Configuration

Run this in your browser console (F12 → Console):

```javascript
// Check Supabase URL
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET')

// Check if Supabase client is working
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
console.log('Supabase client:', supabase)
```

## Common Issues

### Issue 1: Environment Variable Not Set
**Check**: Is `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local`?

**Fix**: Make sure `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uhbtmofnemtwlorxyzxc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### Issue 2: Supabase OAuth Not Enabled
**Check**: Go to Supabase Dashboard → Authentication → Providers → Google

**Fix**: Make sure:
- Toggle is ON
- Client ID is filled
- Client Secret is filled
- Click SAVE

### Issue 3: Wrong Redirect URI
**Check**: In Google Cloud Console, what redirect URIs do you have?

**Fix**: Should ONLY have:
```
https://uhbtmofnemtwlorxyzxc.supabase.co/auth/v1/callback
```

## Quick Test

Try this in your browser console after clicking sign in:

1. Check what URL you're redirected to
2. If it goes to `accounts.google.com` directly, Supabase isn't handling it
3. If it goes to `supabase.co/auth/v1/authorize`, that's correct

## What to Report Back

Please tell me:
1. What URL shows in the console log when you click "Sign in"?
2. What's the first redirect URL in the Network tab?
3. Is your `.env.local` file set up correctly?
4. Is Google provider enabled in Supabase?

