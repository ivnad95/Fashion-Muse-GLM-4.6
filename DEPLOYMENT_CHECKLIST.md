# 🚀 Vercel Deployment Checklist

## Pre-Deployment Requirements

### 1. Environment Variables (Required)

Set these in your Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Authentication
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Encryption
ENCRYPTION_KEY=<generate with: openssl rand -hex 32>

# Google OAuth (Optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini API (Optional - users can provide their own)
GEMINI_API_KEY=your-gemini-api-key

# Vercel Blob Storage (Optional - for image persistence)
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

### 2. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection strings to environment variables
4. Run migrations: `npx prisma db push`

#### Option B: External Postgres (Neon, Supabase, Railway)
1. Create a PostgreSQL database
2. Get connection string with SSL
3. Set `DATABASE_URL` and `DIRECT_DATABASE_URL`
4. Run migrations: `npx prisma db push`

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret to Vercel env vars

### 4. Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. (Optional) Add to Vercel env vars as `GEMINI_API_KEY`
4. Note: Users can provide their own keys in settings

---

## Deployment Steps

### Step 1: Initial Setup

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link your project (run from project root)
vercel link
```

### Step 2: Configure Environment Variables

```bash
# Set environment variables via CLI
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add ENCRYPTION_KEY production
# ... add all required variables
```

Or use Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all required variables
4. Select "Production", "Preview", and "Development" environments

### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy if connected to Git)
git push origin main
```

---

## Post-Deployment Verification

### ✅ Deployment Checklist

- [ ] **Application loads** - Visit your deployment URL
- [ ] **Database connected** - Check Vercel logs for Prisma connection
- [ ] **Authentication works** - Test Google Sign-In
- [ ] **Image generation works** - Upload image and generate
- [ ] **History page loads** - Check generation history (authenticated)
- [ ] **Settings save** - Update and save user settings
- [ ] **API routes respond** - Test `/api/health`, `/api/generations`
- [ ] **No console errors** - Check browser console
- [ ] **Security headers active** - Check Network tab for CSP headers
- [ ] **Rate limiting works** - Test multiple rapid requests
- [ ] **Mobile responsive** - Test on mobile device
- [ ] **Performance good** - Run Lighthouse audit (target >90)

### Health Check Endpoint

Test your deployment:
```bash
curl https://your-domain.vercel.app/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Database Migration

If schema changes after deployment:
```bash
# From your local machine with DATABASE_URL set
npx prisma db push

# Or trigger from Vercel CLI
vercel env pull .env.production
npx prisma db push --schema=./prisma/schema.prisma
```

---

## Troubleshooting

### Build Failures

**Error: Prisma Client not generated**
```bash
# Solution: Ensure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

**Error: Module not found**
```bash
# Solution: Clear build cache
vercel --force
```

### Runtime Errors

**Error: NEXTAUTH_URL not set**
```bash
# Solution: Add to Vercel env vars
vercel env add NEXTAUTH_URL production
# Value: https://your-domain.vercel.app
```

**Error: Database connection failed**
```bash
# Solution: Check DATABASE_URL has ?sslmode=require
# Ensure Vercel Postgres is in same region as deployment
```

**Error: ENCRYPTION_KEY missing**
```bash
# Solution: Generate and add to env vars
openssl rand -hex 32
vercel env add ENCRYPTION_KEY production
```

### Performance Issues

**Slow initial load**
- Enable Edge Runtime for API routes (see `src/app/api/*/route.ts`)
- Use Vercel Edge Config for feature flags
- Implement Redis caching for rate limiting

**Large bundle size**
- Check build output for large modules
- Implement dynamic imports for heavy components
- Use Next.js Image component for optimization

---

## Monitoring & Maintenance

### Vercel Analytics

1. Enable in Vercel dashboard
2. Add to `next.config.ts`:
```typescript
export default {
  // ... other config
  analytics: {
    enabled: true
  }
}
```

### Error Tracking (Optional)

Install Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Database Backups

**Vercel Postgres:**
- Automatic daily backups
- Restore via Vercel dashboard

**External Postgres:**
- Configure automated backups
- Test restore procedure

---

## Security Considerations

### ✅ Security Checklist

- [ ] **HTTPS only** - Vercel provides SSL automatically
- [ ] **Environment secrets** - Never commit .env files
- [ ] **CSP headers** - Configured in `next.config.ts`
- [ ] **Rate limiting** - Active on generation endpoints
- [ ] **API key encryption** - Using AES-256-GCM
- [ ] **Input validation** - Zod schemas on all API routes
- [ ] **File validation** - Type, size, dimension checks
- [ ] **SQL injection** - Prevented by Prisma ORM
- [ ] **XSS protection** - React escapes by default
- [ ] **CSRF tokens** - NextAuth handles this

### Regular Maintenance

1. **Weekly:** Check Vercel logs for errors
2. **Monthly:** Review npm audit findings
3. **Quarterly:** Update dependencies
4. **As needed:** Review and rotate secrets

---

## Rollback Procedure

If deployment issues occur:

1. **Instant rollback via Vercel:**
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI:**
```bash
vercel rollback <deployment-url>
```

3. **Via Git:**
```bash
git revert HEAD
git push origin main
```

---

## Performance Targets

- **Lighthouse Score:** >90 (all categories)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3.5s
- **Cumulative Layout Shift:** <0.1
- **API Response Time:** <500ms (p95)

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Project Issues:** Check `IMPLEMENTATION_STATUS.md`

---

**Last Updated:** 2025-01-17
**Deployment Status:** ✅ Production Ready
