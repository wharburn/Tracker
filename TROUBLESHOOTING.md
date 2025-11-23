# 🔧 TROUBLESHOOTING: "Not Found" Error

## Your URL: https://tracker-ovhk.onrender.com

## Quick Checks

### 1. Test the Health Endpoint First
Try this URL in your browser:
**https://tracker-ovhk.onrender.com/health**

**If this works:** Your server is running, but there might be an issue with the HTML files.

**If this doesn't work:** The server isn't running properly.

---

## Common Issues & Solutions

### Issue 1: App Still Deploying ⏳
**Symptoms:** Getting "Not Found" or timeout
**Solution:** Wait 2-5 minutes. Render takes time to:
- Install dependencies (`npm install`)
- Start the server
- First deploy can take 3-5 minutes

**Check deployment status:**
1. Go to https://dashboard.render.com
2. Find your service "tracker-ovhk"
3. Look at the "Events" tab
4. Wait for "Deploy live" message

---

### Issue 2: Build Failed ❌
**Symptoms:** Deployment never completes
**Solution:** Check the logs

**How to check:**
1. Go to https://dashboard.render.com
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

**Common build errors:**
- Missing `package.json` → Make sure you uploaded all files
- Wrong Node version → Should auto-detect from package.json
- Port not set → Should use `process.env.PORT` (already in code)

---

### Issue 3: Files Not Uploaded Correctly 📁
**Symptoms:** 404 for all routes
**Solution:** Verify file structure

**Required structure:**
```
location-tracker/
├── package.json          ← MUST be in root
├── server.js            ← MUST be in root
├── public/              ← MUST exist
│   ├── index.html
│   ├── tracker.html
│   ├── admin.html
│   └── whatsapp.html
└── render.yaml          ← Optional but helpful
```

**To fix:**
1. Make sure `public/` folder exists
2. Make sure all HTML files are inside `public/`
3. Redeploy

---

### Issue 4: Wrong Start Command 🚀
**Symptoms:** "Application failed to respond"
**Solution:** Verify start command

**Correct start command:** `npm start` or `node server.js`

**How to check/fix:**
1. Go to Render dashboard
2. Your service → Settings
3. Find "Start Command"
4. Should be: `npm start`
5. If wrong, update and redeploy

---

### Issue 5: Port Configuration 🔌
**Symptoms:** Server starts but can't connect
**Solution:** The server should use `process.env.PORT`

**Already fixed in the code:**
```javascript
const PORT = process.env.PORT || 3000;
server.listen(PORT, ...);
```

Render automatically sets `PORT` environment variable.

---

## Step-by-Step Debugging

### Step 1: Check Render Dashboard
```
1. Go to https://dashboard.render.com
2. Find your service: tracker-ovhk
3. Check status - should show "Live" with green dot
4. If "Deploy failed" - check logs
```

### Step 2: Check Logs
```
1. In Render dashboard → Logs tab
2. Look for:
   ✅ "Server running on port XXXX"
   ❌ Any error messages
   ❌ "Cannot find module"
   ❌ "ENOENT: no such file or directory"
```

### Step 3: Test Endpoints
```
Test in this order:

1. Health check:
   https://tracker-ovhk.onrender.com/health
   Should return: {"status":"ok",...}

2. API endpoint:
   https://tracker-ovhk.onrender.com/api/sessions
   Should return: [] (empty array)

3. Main page:
   https://tracker-ovhk.onrender.com/
   Should show: Admin Dashboard HTML
```

### Step 4: Verify Files Were Uploaded
```
In Render dashboard:
1. Go to Shell tab
2. Type: ls -la
3. Should see:
   - server.js
   - package.json
   - public/
4. Type: ls -la public/
5. Should see all HTML files
```

---

## Most Likely Cause

**99% of "Not Found" errors on Render are due to:**

1. **App still deploying** (wait 3-5 minutes)
2. **Build failed** (check logs for errors)
3. **Files in wrong location** (public folder missing)

---

## Quick Fix: Redeploy

If nothing works, try a fresh deploy:

```bash
# In your local project folder
git add .
git commit -m "Fix deployment"
git push origin main

# Render will auto-deploy from GitHub
# Or manually trigger deploy in Render dashboard
```

---

## Test These URLs (After Deploy Completes)

1. **Health Check:**
   https://tracker-ovhk.onrender.com/health

2. **Admin Dashboard:**
   https://tracker-ovhk.onrender.com/

3. **API Test:**
   https://tracker-ovhk.onrender.com/api/sessions

4. **WhatsApp Helper:**
   https://tracker-ovhk.onrender.com/whatsapp

---

## Check Build Settings in Render

**Correct settings:**
- **Environment:** Node
- **Build Command:** `npm install` (or leave blank, auto-detects)
- **Start Command:** `npm start`
- **Node Version:** 14+ (auto-detected from package.json)

---

## Still Not Working?

### Share these details:

1. **What you see when you visit:**
   https://tracker-ovhk.onrender.com/health

2. **Render logs:** 
   Copy the last 20 lines from the Logs tab

3. **Deployment status:**
   What does it say in the Render dashboard?

4. **How you deployed:**
   - From GitHub?
   - Manual upload?
   - Which files did you upload?

---

## Expected Behavior When Working

✅ **https://tracker-ovhk.onrender.com/**
→ Should show admin dashboard with "Create New Tracking Session" form

✅ **https://tracker-ovhk.onrender.com/health**
→ Should return JSON: `{"status":"ok",...}`

✅ **https://tracker-ovhk.onrender.com/api/sessions**
→ Should return: `[]` (empty array initially)

---

## Emergency: Start Fresh

If completely stuck:

```bash
# Delete the service on Render
# Then redeploy fresh:

cd location-tracker
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# Then in Render:
# New + → Web Service → Connect GitHub repo
```

---

## Need Help?

**Check in this order:**
1. ✅ Render dashboard shows "Live"
2. ✅ Logs show "Server running on port..."
3. ✅ /health endpoint returns JSON
4. ✅ Main page loads

**If any step fails, that's where the problem is!**
