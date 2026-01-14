# ⚡ Timeless App - Quick Start Checklist

**Use this alongside the full deployment guide for quick reference**

---

## 🚀 PRE-FLIGHT (Do These First)

```bash
# 1. Create accounts (5 minutes)
□ GitHub account
□ Vercel account (sign up with GitHub)
□ Supabase account
□ Cloudflare account

# 2. Verify local setup
□ Node.js installed (v18+): node --version
□ Git installed: git --version
□ VS Code open with your project
```

---

## 📋 DAY 1: CODE SETUP (2 hours)

### A. Git Repository

```bash
# In your project folder (open terminal in VS Code)
□ git init
□ Create .gitignore (copy from deployment guide)
□ git add .
□ git commit -m "Initial commit"

# Create GitHub repo (use website):
□ Go to github.com/new
□ Name: timeless-app
□ Public or Private: Your choice
□ Don't initialize with README

# Connect and push:
□ git remote add origin https://github.com/YOUR_USERNAME/timeless-app.git
□ git branch -M main
□ git push -u origin main
```

### B. Update Dependencies

```bash
# Install proper Tailwind
□ npm install -D tailwindcss postcss autoprefixer
□ npx tailwindcss init -p

# Install Supabase & React Query
□ npm install @supabase/supabase-js @tanstack/react-query

# Install utilities
□ npm install zod date-fns

# Clean install everything
□ rm -rf node_modules package-lock.json
□ npm install
```

### C. Environment Variables

```bash
# Create .env.local in your project root
□ Copy template from deployment guide
□ Leave Supabase values empty for now (we'll fill them next)
```

---

## 📋 DAY 2: BACKEND SETUP (2 hours)

### A. Create Supabase Project

```bash
□ Go to supabase.com
□ Click "New Project"
□ Fill details:
  Name: timeless-app
  Database Password: (SAVE THIS!)
  Region: (closest to users)
□ Wait 2 minutes for setup
```

### B. Setup Database

```bash
□ Open Supabase Dashboard
□ Go to SQL Editor
□ Copy ENTIRE database schema from deployment guide
□ Click "Run" to execute
□ Verify tables created (should see: profiles, talents, events, etc.)
```

### C. Get API Keys

```bash
□ In Supabase: Settings → API
□ Copy Project URL
□ Copy anon public key
□ Update .env.local with these values
```

### D. Setup Storage Buckets

```bash
□ In Supabase: Storage
□ Create bucket: "avatars" (public)
□ Create bucket: "portfolios" (public)
□ Create bucket: "event-media" (public)
□ Run storage policies from deployment guide
```

---

## 📋 DAY 3: CODE INTEGRATION (3 hours)

### A. Create Core Files

```bash
# Copy these files from deployment guide:
□ src/lib/supabase.ts (Supabase client)
□ src/lib/queryClient.ts (React Query setup)
□ src/hooks/useAuth.ts (Authentication)
□ src/hooks/useTalents.ts (Talents API)
```

### B. Update Main Files

```bash
□ Update src/main.tsx (add QueryClientProvider)
□ Update tailwind.config.js (custom theme)
□ Update vite.config.ts (optimization)
```

### C. Test Locally

```bash
□ npm run dev
□ Open http://localhost:5173
□ Test signup/login
□ Check browser console for errors
□ Verify Supabase connection in Network tab
```

---

## 📋 DAY 4: DOMAIN SETUP (1 hour)

### A. Cloudflare Setup

```bash
□ Go to cloudflare.com
□ Click "Add a Site"
□ Enter: timelessapp.io
□ Select Free plan
□ Copy the 2 nameservers (ns1.cloudflare.com, ns2.cloudflare.com)
```

### B. Update Hostinger

```bash
□ Log in to Hostinger
□ Go to Domains → DNS Zone
□ Change nameservers to Cloudflare's
□ Save and wait (can take 24-48 hours)
```

### C. Configure Cloudflare (do after nameservers active)

```bash
□ Add DNS Records:
  Type: CNAME, Name: @, Target: (wait for Vercel)
  Type: CNAME, Name: www, Target: (wait for Vercel)
□ SSL/TLS → Full (strict)
□ Speed → Auto Minify → Enable all
```

---

## 📋 DAY 5: DEPLOYMENT (2 hours)

### A. Deploy to Vercel

```bash
□ Go to vercel.com
□ Sign up with GitHub
□ Click "Add New" → "Project"
□ Import: timeless-app repository
□ Verify settings:
  Framework: Vite
  Build Command: npm run build
  Output: dist
□ Add Environment Variables:
  VITE_SUPABASE_URL: (from Supabase)
  VITE_SUPABASE_ANON_KEY: (from Supabase)
□ Click "Deploy"
□ Wait 2-3 minutes
□ Note your Vercel URL: something.vercel.app
```

### B. Connect Custom Domain

```bash
□ In Vercel: Project → Settings → Domains
□ Add domain: timelessapp.io
□ Add domain: www.timelessapp.io
□ Vercel will show you what to add in DNS
```

### C. Update Cloudflare DNS

```bash
□ Back to Cloudflare
□ Update DNS records with Vercel's target
□ Save
□ Wait 5-10 minutes for propagation
```

---

## 📋 DAY 6: TESTING & POLISH (2 hours)

### A. Verify Production

```bash
□ Visit https://timelessapp.io
□ Test on different browsers:
  □ Chrome
  □ Safari
  □ Firefox
□ Test on mobile (use phone)
□ Test core features:
  □ Homepage loads
  □ Sign up works
  □ Login works
  □ Browse talents
  □ Create booking
  □ Send message
```

### B. Add Monitoring

```bash
# Sentry (error tracking)
□ npm install @sentry/react
□ Copy sentry.ts from guide
□ Update main.tsx
□ Get Sentry DSN from sentry.io
□ Add to environment variables

# Analytics
□ npm install @vercel/analytics
□ Add to main.tsx
```

### C. Performance Check

```bash
# Run Lighthouse
□ Open Chrome DevTools
□ Lighthouse tab
□ Generate report
□ Fix any critical issues (aim for 90+ on all scores)
```

---

## 📋 WEEK 2: OPTIMIZATION

### Security

```bash
□ Review all environment variables are secret
□ Test authentication flows thoroughly
□ Add rate limiting (optional for now)
□ Enable 2FA on all accounts (GitHub, Vercel, Supabase)
```

### Performance

```bash
□ Optimize images (use webp format)
□ Add lazy loading to routes
□ Check bundle size
□ Enable caching headers
```

### UX Polish

```bash
□ Add loading states to all async operations
□ Add error boundaries
□ Improve mobile navigation
□ Add success/error toast notifications
```

---

## 🎯 LAUNCH CHECKLIST

### Pre-Launch

```bash
□ All core features working
□ No console errors
□ Mobile responsive
□ Fast load times (<3 seconds)
□ SSL certificate active (https)
□ Error tracking setup
□ Analytics tracking setup
□ Backup strategy in place
```

### Launch Day

```bash
□ Announce on social media
□ Send to beta users
□ Monitor errors in Sentry
□ Watch analytics in Vercel
□ Be ready to respond to issues
```

### Post-Launch (First Week)

```bash
□ Daily monitoring of uptime
□ Review user feedback
□ Fix critical bugs immediately
□ Track key metrics:
  - Sign ups
  - Active users
  - Error rate
  - Page load time
```

---

## 🆘 EMERGENCY CONTACTS & LINKS

### Quick Links

```bash
Production Site: https://timelessapp.io
Vercel Dashboard: https://vercel.com/dashboard
Supabase Dashboard: https://app.supabase.com
Cloudflare Dashboard: https://dash.cloudflare.com
GitHub Repo: https://github.com/YOUR_USERNAME/timeless-app

Error Tracking: https://sentry.io
Status Page: https://stats.uptimerobot.com (if setup)
```

### Emergency Commands

```bash
# Rollback deployment (if something breaks)
vercel rollback

# Check deployment logs
vercel logs

# Check production build locally
npm run build && npm run preview

# Quick database backup
# Go to Supabase → Database → Backups → Create Backup
```

---

## 📊 SUCCESS METRICS

### Week 1 Goals

```bash
□ Site accessible at https://timelessapp.io
□ Zero critical errors in Sentry
□ 10+ test user signups
□ All core features working
□ <3 second load time
□ 95+ Lighthouse score
```

### Month 1 Goals

```bash
□ 100+ registered users
□ 10+ active bookings
□ <1% error rate
□ 99.9% uptime
□ Positive user feedback
```

---

## 💡 PRO TIPS

### Development

- Always test locally before pushing to GitHub
- Use meaningful commit messages
- Create a staging environment (optional but recommended)
- Keep dependencies updated (check monthly)

### Deployment

- Vercel auto-deploys on git push to main
- Use environment variables for all secrets
- Never commit .env files to git
- Test on production URL after each deploy

### Monitoring

- Check Vercel analytics daily
- Review Sentry errors weekly
- Monitor Supabase usage to avoid hitting limits
- Backup database before major changes

### Scaling

- Free tier supports ~500 users
- Monitor Supabase database size (500MB limit)
- Watch bandwidth usage
- Plan upgrade at 80% of free tier limits

---

## ✅ COMPLETION CHECKLIST

Mark when fully complete:

```bash
□ Code in GitHub
□ Frontend deployed to Vercel
□ Database on Supabase
□ Domain configured (timelessapp.io)
□ SSL certificate active
□ Error tracking setup
□ Analytics running
□ Mobile tested
□ Performance optimized
□ Monitoring in place
□ Ready for users! 🎉
```

---

## 📞 NEED HELP?

### Common Issues

1. **Build fails**: Check package.json scripts, verify Node version
2. **Domain not working**: Wait 24-48 hours for DNS propagation
3. **Database errors**: Check Supabase connection and RLS policies
4. **Authentication fails**: Verify environment variables are correct

### Resources

- Deployment Guide: See main TIMELESS_DEPLOYMENT_GUIDE.md
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- React Query: https://tanstack.com/query/latest

### Support Communities

- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://discord.gg/vercel
- React Discord: https://discord.gg/react

---

**Remember**: Take it one step at a time. Each checkbox is progress! 🚀

**Version**: 1.0  
**Last Updated**: January 2026