# 🔧 Vercel Deployment Fix - 404 Error Solution

## ❌ The Problem

You're getting a 404 error because:
- **Frontend** (Vercel): `https://zenithmomentum.vercel.app/`
- **Backend** (Render): `https://winter-arc-9t0t.onrender.com`
- Frontend is trying to call `/api/auth/register` on Vercel instead of Render

## ✅ The Solution

You need to tell your Vercel frontend where your backend is located.

---

## 📋 Step 1: Set Environment Variable in Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `zenithmomentum`

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Environment Variable**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://winter-arc-9t0t.onrender.com/api`
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Click "..." menu → "Redeploy"
   - OR push a new commit to trigger automatic deployment

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to your frontend directory
cd frontend

# Add environment variable
vercel env add VITE_API_BASE_URL

# When prompted, enter:
# Value: https://winter-arc-9t0t.onrender.com/api
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

---

## 📋 Step 2: Update Backend CORS (Already Done!)

I've updated your `backend/server.js` to allow requests from Vercel:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://zenithmomentum.vercel.app',  // ← Your Vercel frontend
    'https://winter-arc-9t0t.onrender.com'
  ],
  credentials: true
}));
```

**To apply this change:**

```bash
# From the tracker directory
cd backend

# Commit and push changes
git add server.js
git commit -m "Update CORS to allow Vercel frontend"
git push origin main
```

Render will automatically redeploy your backend.

---

## 📋 Step 3: Create `.env` File for Local Development

Create `frontend/.env` for local testing:

```env
VITE_API_BASE_URL=https://winter-arc-9t0t.onrender.com/api
```

This lets you test locally with the production backend.

---

## ✅ Verification Steps

After setting the environment variable and redeploying:

### 1. Check Environment Variable
In Vercel Dashboard → Settings → Environment Variables, you should see:
```
VITE_API_BASE_URL = https://winter-arc-9t0t.onrender.com/api
```

### 2. Check Build Logs
In Vercel Deployments → Latest Deployment → Building:
- Look for: `Environment variables loaded`
- Should show `VITE_API_BASE_URL`

### 3. Test API Connection
Open browser console on your Vercel site:
```javascript
// Should log your backend URL
console.log(import.meta.env.VITE_API_BASE_URL);
```

### 4. Test Registration/Login
- Go to: https://zenithmomentum.vercel.app/register
- Try creating an account
- Should work without 404 error

### 5. Check Network Tab
- Open DevTools → Network tab
- Try to register
- API calls should go to: `https://winter-arc-9t0t.onrender.com/api/auth/register`
- NOT to: `https://zenithmomentum.vercel.app/api/auth/register`

---

## 🐛 Troubleshooting

### Issue 1: Still Getting 404
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue 2: CORS Error Instead
**Solution:** Make sure backend changes are pushed and deployed to Render

### Issue 3: Environment Variable Not Working
**Solution:** 
1. Check spelling: `VITE_API_BASE_URL` (must start with `VITE_`)
2. Redeploy after adding variable
3. Check it's set for Production environment

### Issue 4: Backend is Sleeping (Render Free Tier)
**Solution:** 
- Render free tier spins down after 15 minutes
- First request might take 30-60 seconds to wake up
- Wait and try again

---

## 📝 Quick Summary

| Step | Action | Where |
|------|--------|-------|
| 1 | Add env var `VITE_API_BASE_URL` | Vercel Dashboard |
| 2 | Set value to backend URL | `https://winter-arc-9t0t.onrender.com/api` |
| 3 | Redeploy frontend | Vercel |
| 4 | Push backend CORS update | GitHub → Render |
| 5 | Test registration | Vercel site |

---

## 🎯 Expected Behavior After Fix

### Before Fix:
```
❌ Request: https://zenithmomentum.vercel.app/api/auth/register
❌ Response: 404 Not Found
```

### After Fix:
```
✅ Request: https://winter-arc-9t0t.onrender.com/api/auth/register
✅ Response: 200 OK with user token
```

---

## 📸 Screenshot Guide for Vercel Dashboard

1. **Navigate to Project Settings**
   ```
   Vercel Dashboard → Your Projects → zenithmomentum → Settings
   ```

2. **Environment Variables Section**
   ```
   Settings → Environment Variables (left sidebar)
   ```

3. **Add Variable Form**
   ```
   Name: VITE_API_BASE_URL
   Value: https://winter-arc-9t0t.onrender.com/api
   Environments: ✓ Production ✓ Preview ✓ Development
   [Save Button]
   ```

4. **Redeploy**
   ```
   Deployments tab → Latest → ... menu → Redeploy
   ```

---

## 🔄 Alternative: Using Vercel Serverless Functions (Optional)

If you want to keep everything on Vercel, you could migrate your backend to Vercel serverless functions. But keeping it on Render is totally fine!

---

## ✅ Checklist

- [ ] Set `VITE_API_BASE_URL` in Vercel environment variables
- [ ] Value is `https://winter-arc-9t0t.onrender.com/api` (with `/api` at end)
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed Vercel site
- [ ] Pushed CORS update to backend
- [ ] Waited for Render to redeploy
- [ ] Tested registration on live site
- [ ] Tested login on live site
- [ ] Checked Network tab shows correct backend URL

---

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. **Check Backend Status**
   ```bash
   curl https://winter-arc-9t0t.onrender.com/api/health
   ```
   Should return: `{"status":"Momentum Backend is running! ⚡"}`

2. **Check Frontend Build Logs**
   - Vercel Dashboard → Deployments → Latest → View Build Logs
   - Look for errors during build

3. **Check Runtime Logs**
   - Vercel Dashboard → Deployments → Latest → View Function Logs
   - Look for runtime errors

4. **Test Backend Directly**
   ```bash
   curl -X POST https://winter-arc-9t0t.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

---

**After you set the environment variable in Vercel and redeploy, everything should work perfectly! ⚡**

Let me know if you need any clarification on these steps!

