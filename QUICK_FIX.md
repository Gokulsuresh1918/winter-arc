# 🚀 QUICK FIX - Vercel Still Calling Wrong API

## The Issue
Your environment variables are set in Vercel, but the build isn't using them. The app is still calling `https://zenithmomentum.vercel.app/api` instead of your Render backend.

## ✅ SOLUTION 1: Force Rebuild (Fastest)

I've updated the code with a fallback to your backend URL. Now follow these steps:

### Step 1: Commit & Push Changes
```bash
# Make sure you're in the project root
git add .
git commit -m "Fix API URL for production"
git push origin main
```

Vercel will automatically detect the push and redeploy with the correct URL.

### Step 2: Wait & Test
- Wait 2-3 minutes for Vercel to rebuild
- Go to https://zenithmomentum.vercel.app/register
- Try to register - should work now!

---

## ✅ SOLUTION 2: Manual Trigger (Alternative)

If auto-deploy doesn't work:

1. Go to Vercel Dashboard → zenithmomentum
2. Go to "Deployments" tab
3. Click on the latest deployment
4. Click "..." → "Redeploy"
5. **IMPORTANT**: Check "Use existing Build Cache" is **UNCHECKED**
6. Click "Redeploy"

---

## 🔍 What I Changed

### File: `frontend/src/utils/api.js`
**Before:**
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',  // ❌ Falls back to same domain
});
```

**After:**
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://winter-arc-9t0t.onrender.com/api',  // ✅ Falls back to your backend
});
```

### New File: `frontend/.env.production`
```
VITE_API_BASE_URL=https://winter-arc-9t0t.onrender.com/api
```

---

## 📝 Why This Happened

Vercel environment variables sometimes don't get injected during the build properly. The fallback now ensures it always points to your backend.

---

## ✅ Verification

After redeployment, check DevTools → Network tab:

**Should see:**
```
✅ POST https://winter-arc-9t0t.onrender.com/api/auth/register
✅ Status: 200 OK
```

**Should NOT see:**
```
❌ POST https://zenithmomentum.vercel.app/api/auth/register
❌ Status: 404
```

---

## 🎯 Quick Commands Summary

```bash
# 1. Commit changes
git add .
git commit -m "Fix API URL fallback for production"

# 2. Push to trigger Vercel rebuild
git push origin main

# 3. Check status
# Visit Vercel Dashboard → Deployments
# Wait for "Building..." → "Ready"

# 4. Test
# Visit: https://zenithmomentum.vercel.app/register
# Try to create account
```

---

## 🐛 If Still Not Working

### Check 1: Verify Environment Variables in Vercel
Should have:
```
VITE_API_BASE_URL = https://winter-arc-9t0t.onrender.com/api
```

### Check 2: Clear Build Cache
- Vercel Dashboard → Settings → General
- Scroll to "Build & Development Settings"  
- Under "Build Command", temporarily add `--force` flag
- Or just click "Redeploy" with cache unchecked

### Check 3: Check Build Logs
- Vercel Dashboard → Deployments → Latest
- Click "Building"
- Look for any errors
- Should see: "Environment Variables loaded"

### Check 4: Test Backend Directly
```bash
curl https://winter-arc-9t0t.onrender.com/api/health
```
Should return:
```json
{"status":"Momentum Backend is running! ⚡"}
```

---

## 🔄 Alternative: Remove VITE_APP_NAME Conflict

You have `VITE_APP_NAME` set with hidden value. This might be causing issues. Try:

1. Vercel Dashboard → Settings → Environment Variables
2. Delete `VITE_APP_NAME` (not needed)
3. Keep only `VITE_API_BASE_URL`
4. Redeploy

---

**After you push the changes, it should work immediately!** ⚡

