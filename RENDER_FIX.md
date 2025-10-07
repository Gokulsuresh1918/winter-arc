# 🔴 RENDER DEPLOYMENT ERROR - QUICK FIX

## ⚡ Momentum - Deployment Guide

## Your Error:
```
npm error path /opt/render/project/src/package.json
npm error enoent Could not read package.json
```

## Why This Happens:
Your project structure is:
```
tracker/
├── backend/
│   └── package.json  ← Backend package.json is HERE
└── frontend/
    └── package.json  ← Frontend package.json is HERE
```

But Render is looking for `package.json` in the root directory!

---

## ✅ SOLUTION: Set Root Directory

### For Backend Service:

1. **Go to Render Dashboard** → Your Service → **Settings**

2. **Find "Root Directory" setting**

3. **Change it to:** `backend`

4. **Save Changes**

5. **Verify these settings:**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

6. **Manual Deploy**: Click "Manual Deploy" → "Deploy latest commit"

### For Frontend Service:

1. **Create a NEW Static Site** (not a Web Service)

2. **Settings:**
   ```
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable:**
   ```
   VITE_API_BASE_URL=https://YOUR-BACKEND-URL.onrender.com/api
   ```

---

## 🎯 Step-by-Step Fix (Right Now)

### If you're deploying the BACKEND:

```
1. Open your Render service
2. Go to "Settings" tab
3. Scroll to "Build & Deploy"
4. Find "Root Directory"
5. Enter: backend
6. Click "Save Changes"
7. Go to "Manual Deploy" tab
8. Click "Deploy latest commit"
```

### If you're deploying the FRONTEND:

```
1. Create a NEW service (Static Site, not Web Service)
2. Connect your repo
3. Root Directory: frontend
4. Build Command: npm install && npm run build
5. Publish Directory: dist
6. Add env var: VITE_API_BASE_URL=https://your-backend.onrender.com/api
7. Create Static Site
```

---

## 📸 Screenshots Guide

**Where to find Root Directory setting:**

```
Render Dashboard
  → [Your Service Name]
    → Settings (left sidebar)
      → Build & Deploy section
        → Root Directory field ← CHANGE THIS TO "backend" or "frontend"
```

---

## 🚨 Important Notes

1. **Deploy Backend and Frontend SEPARATELY** as two different services
2. **Backend** = Web Service (Root Dir: `backend`)
3. **Frontend** = Static Site (Root Dir: `frontend`)
4. **Don't forget** to update CORS in backend with your frontend URL

---

## ✅ Verify It's Fixed

After changing Root Directory, your build logs should show:

```
==> Cloning from https://github.com/...
==> Checking out commit abcd1234 in branch main
==> Using Node version 18.x (default)
==> Docs on specifying a Node version: ...
==> Running 'npm install' in /opt/render/project/src/backend
npm notice Created a lockfile as package-lock.json
...
added 145 packages
==> Running 'npm start'
Server running on port 5000 ✅
```

Notice it now says: `in /opt/render/project/src/backend` instead of just `src/`!

---

## 🆘 Still Not Working?

### Option 1: Use render.yaml (Recommended)

I've created a `render.yaml` file in your project root. 

1. **Commit and push** the `render.yaml` file
2. **Delete your current service** on Render
3. **Create New** → **Blueprint**
4. **Connect your repo**
5. Render will auto-configure everything!

### Option 2: Manual Deploy Script

If you want to deploy from your local machine, you can create a script to help:

**For Backend:**
```bash
cd backend
npm install
npm start
```

But you still need to set Root Directory in Render!

---

## 📚 Full Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment variables
- [render.yaml](./render.yaml) - Auto-configuration file

---

**TL;DR: Go to Render Settings → Root Directory → Set to "backend" → Save → Redeploy**

