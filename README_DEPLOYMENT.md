# 🚀 Hybrid Deployment - Quick Start

Your Next.js project has been configured for hybrid frontend/backend deployment with automatic CI/CD!

## ✅ What Was Done

### 1. Code Changes
- ✅ Marketing pages converted from SSR to ISR (1-hour cache)
- ✅ PM2 ecosystem configured for dual instances (frontend + backend)
- ✅ Deployment scripts created (`scripts/deploy-*.sh`)
- ✅ Package.json updated with deployment commands

### 2. CI/CD Setup
- ✅ GitHub Actions workflows created:
  - `deploy-frontend.yml` - Auto-deploys marketing pages
  - `deploy-backend.yml` - Auto-deploys admin + API
  - `deploy-all.yml` - Full deployment trigger

### 3. Configuration Files
- ✅ NGINX config for aaPanel (`nginx/sjmedialabs.conf`)
- ✅ Deployment documentation (`DEPLOYMENT.md`)
- ✅ GitHub secrets guide (`GITHUB_SECRETS_SETUP.md`)
- ✅ aaPanel setup guide (`nginx/AAPANEL_SETUP.md`)

## 🎯 Next Steps (What YOU Need to Do)

### Step 1: Set Up GitHub Secrets (5 minutes)

Follow the guide: `GITHUB_SECRETS_SETUP.md`

Quick summary:
1. Generate SSH key for GitHub Actions
2. Add public key to server
3. Add 3 secrets to GitHub repository:
   - `SERVER_HOST`: `31.97.224.169`
   - `SERVER_USER`: `root`
   - `SSH_PRIVATE_KEY`: Your private key content

### Step 2: Push This Code to GitHub

```bash
cd /Users/alviongs/Documents/Projects/sjml

git add .
git commit -m "Implement hybrid deployment with CI/CD"
git push origin main
```

This will trigger the first automatic deployment!

### Step 3: Configure NGINX in aaPanel (10 minutes)

Follow the guide: `nginx/AAPANEL_SETUP.md`

Quick summary:
1. Login to aaPanel
2. Find sjmedialabs.com → Settings → Config File
3. Copy contents from `nginx/sjmedialabs.conf`
4. Save and reload NGINX

### Step 4: Verify Everything Works

1. **Check PM2 status**:
   ```bash
   ssh root@31.97.224.169
   pm2 status
   ```
   
2. **Test frontend**: https://sjmedialabs.com
3. **Test admin**: https://sjmedialabs.com/admin/login
4. **Test API**: https://sjmedialabs.com/api/content/home

## 📖 How It Works

### Architecture

```
sjmedialabs.com
├─ /              → Frontend (port 3000) - Marketing pages with ISR
├─ /admin         → Backend (port 1001) - Admin dashboard
└─ /api           → Backend (port 1001) - API routes
```

### Content Updates

**Admin edits content** → **MongoDB updated** → **No rebuild needed!** → **Changes visible within 1 hour**

ISR automatically revalidates pages every hour. For instant updates, restart frontend:
```bash
pm2 restart sjml-frontend
```

### Code Changes

**Push to GitHub** → **GitHub Actions triggered** → **Auto-deploy** → **PM2 restarted** → **Live in 3-5 minutes**

## 🛠️ Useful Commands

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build production
npm run lint         # Run linter
```

### PM2 Management
```bash
npm run pm2:status   # Check status
npm run pm2:logs     # View logs
npm run pm2:restart  # Restart all
```

### Manual Deployment
```bash
npm run deploy:frontend  # Deploy frontend only
npm run deploy:backend   # Deploy backend only
npm run deploy:all       # Deploy everything
```

## 📚 Documentation

- **Full deployment guide**: `DEPLOYMENT.md`
- **GitHub secrets setup**: `GITHUB_SECRETS_SETUP.md`
- **NGINX/aaPanel setup**: `nginx/AAPANEL_SETUP.md`

## ⚠️ Important Notes

### Security
- ✅ `.env` is in `.gitignore` - never commit secrets
- ✅ Ports 3000 and 1001 should ONLY be accessible via NGINX proxy
- ⚠️ Set up SSL certificate in aaPanel for HTTPS

### ISR Cache
- Marketing pages cached for 1 hour
- Content changes via admin reflected within 1 hour
- For instant updates, manually restart frontend PM2 instance

### GitHub Actions
- Automatically deploys on push to `main` branch
- Different workflows for frontend vs. backend changes
- Can also trigger manually from Actions tab

## 🐛 Troubleshooting

### Site shows 502 error
```bash
ssh root@31.97.224.169
pm2 status
pm2 restart ecosystem.config.js
```

### Changes not appearing
```bash
ssh root@31.97.224.169
cd /www/wwwroot/sjml
git pull origin main
npm run build
pm2 restart ecosystem.config.js
```

### GitHub Actions failing
- Check Actions tab for error logs
- Verify GitHub secrets are configured correctly
- Test SSH connection manually

## 📞 Support

For detailed troubleshooting, see `DEPLOYMENT.md`

Email: info@sjmedialabs.com  
Phone: +91 40 40268570

---

## 🎉 That's It!

Your project is now set up for:
- ✅ Hybrid frontend/backend deployment
- ✅ Automatic CI/CD via GitHub Actions
- ✅ ISR caching for fast marketing pages
- ✅ Instant content updates via admin (no rebuild)

**Just push code and it auto-deploys! 🚀**
