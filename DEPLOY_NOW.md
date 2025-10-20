# 🚀 Deploy Now - Quick Setup Guide

## ⚠️ Deployment Blocked: Missing Environment Variables

Your deployment failed because environment variables aren't set yet. Here's how to fix it:

---

## 🔐 Your Generated Secrets

**IMPORTANT:** Copy these now! They were generated securely:

```bash
NEXTAUTH_SECRET=fHevXzCD4WceDkTjR1nSCWEL4xrC0y85YE0WlwNZxFA=
ENCRYPTION_KEY=c9fabe5f316b5b612266bb9f2bcad0304fb7cc0d36393e32bc49bd598329cd22
```

---

## 📝 Quick Setup (2 Options)

### Option A: Vercel Dashboard (Easiest - 3 minutes)

1. **Go to:** https://vercel.com/ivnad95/fashion-muse-glm-4-6-v2/settings/environment-variables

2. **Add these variables** (one by one):

   **Required Variables:**
   ```
   Name: NEXTAUTH_SECRET
   Value: fHevXzCD4WceDkTjR1nSCWEL4xrC0y85YE0WlwNZxFA=
   Environment: Production, Preview, Development
   
   Name: ENCRYPTION_KEY
   Value: c9fabe5f316b5b612266bb9f2bcad0304fb7cc0d36393e32bc49bd598329cd22
   Environment: Production, Preview, Development
   
   Name: NEXTAUTH_URL
   Value: https://fashion-muse-glm-4-6-v2.vercel.app
   Environment: Production
   
   Name: DATABASE_URL
   Value: [Your PostgreSQL connection string]
   Environment: Production, Preview, Development
   
   Name: DIRECT_DATABASE_URL
   Value: [Same as DATABASE_URL]
   Environment: Production, Preview, Development
   ```

   **Optional Variables:**
   ```
   Name: GOOGLE_CLIENT_ID
   Value: [Your Google OAuth Client ID]
   
   Name: GOOGLE_CLIENT_SECRET
   Value: [Your Google OAuth Client Secret]
   
   Name: GEMINI_API_KEY
   Value: [Your Gemini API Key]
   ```

3. **After adding variables, deploy:**
   ```bash
   vercel --prod
   ```

---

### Option B: CLI (Fastest - 1 minute)

Run these commands:

```bash
# Required secrets
echo "fHevXzCD4WceDkTjR1nSCWEL4xrC0y85YE0WlwNZxFA=" | vercel env add NEXTAUTH_SECRET production
echo "c9fabe5f316b5b612266bb9f2bcad0304fb7cc0d36393e32bc49bd598329cd22" | vercel env add ENCRYPTION_KEY production
echo "https://fashion-muse-glm-4-6-v2.vercel.app" | vercel env add NEXTAUTH_URL production

# Database (you need to provide these)
vercel env add DATABASE_URL production
# Paste your PostgreSQL URL when prompted

vercel env add DIRECT_DATABASE_URL production
# Paste the same PostgreSQL URL

# Optional: Google OAuth
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# Optional: Gemini API
vercel env add GEMINI_API_KEY production

# Deploy
vercel --prod
```

---

## 🗄️ Need a Database? Quick Setup

### Vercel Postgres (Recommended - Free tier available)

1. Go to: https://vercel.com/ivnad95/fashion-muse-glm-4-6-v2/stores
2. Click "Create" → "Postgres"
3. Name it "fashion-muse-db"
4. Click "Create"
5. Environment variables will be auto-added!

### Alternative: Neon (Free)

1. Go to: https://neon.tech
2. Create account and new project
3. Copy connection string (ends with `?sslmode=require`)
4. Add as DATABASE_URL

### Alternative: Supabase (Free)

1. Go to: https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Add `?sslmode=require` to the end
5. Add as DATABASE_URL

---

## ✅ Verification Checklist

Before deploying, ensure you have:

- [ ] NEXTAUTH_SECRET (generated above)
- [ ] ENCRYPTION_KEY (generated above)
- [ ] NEXTAUTH_URL (https://fashion-muse-glm-4-6-v2.vercel.app)
- [ ] DATABASE_URL (from Vercel Postgres, Neon, or Supabase)
- [ ] DIRECT_DATABASE_URL (same as DATABASE_URL)
- [ ] Optional: GOOGLE_CLIENT_ID
- [ ] Optional: GOOGLE_CLIENT_SECRET
- [ ] Optional: GEMINI_API_KEY

---

## 🚀 Ready to Deploy!

Once environment variables are set:

```bash
vercel --prod
```

Expected output:
```
✅ Production: https://fashion-muse-glm-4-6-v2.vercel.app [copied to clipboard]
```

---

## 🔍 After Deployment

1. **Visit:** https://fashion-muse-glm-4-6-v2.vercel.app
2. **Test:** Upload an image and generate
3. **Check:** `/api/health` endpoint returns `{"status":"ok"}`
4. **Verify:** Sign in with Google (if configured)

---

## 🆘 Troubleshooting

### "Database connection failed"
- Ensure `?sslmode=require` is in DATABASE_URL
- Check database is accessible externally
- Verify credentials are correct

### "NEXTAUTH_URL not set"
- Make sure it's set to your actual Vercel URL
- Include https:// protocol
- Match it exactly to your deployment URL

### Build fails
```bash
# Clear cache and redeploy
vercel --force --prod
```

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Database Setup:** See `DEPLOYMENT_CHECKLIST.md`
- **Full Guide:** See `DEPLOYMENT_READY.md`

---

**Next Action:** Set up environment variables using Option A or B above, then run `vercel --prod`

🎯 You're one step away from deployment!
