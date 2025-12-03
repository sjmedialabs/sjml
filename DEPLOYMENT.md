# Deployment Guide - SJ Media Labs

Complete guide for deploying the hybrid frontend/backend Next.js architecture with CI/CD.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  sjmedialabs.com (NGINX)                                │
│  ├─ /           → Frontend (port 3000) ISR Marketing    │
│  ├─ /admin      → Backend (port 1001) Dynamic Admin     │
│  └─ /api        → Backend (port 1001) Dynamic API       │
└─────────────────────────────────────────────────────────┘
```

### Components

- **Frontend (Port 3000)**: Marketing pages with ISR (1-hour revalidation)
  - Home, About, Services, Case Studies, Work, Insights, etc.
  - Fetches data from MongoDB at build time + revalidation
  - Content updates via admin are reflected within 1 hour max

- **Backend (Port 1001)**: Admin CMS + API routes
  - Admin dashboard for content management
  - API endpoints for CRUD operations
  - Direct MongoDB, Twilio integration

## 📋 Prerequisites

- [x] Server with Ubuntu/Debian (31.97.224.169)
- [x] Node.js 20+ installed
- [x] PM2 installed globally (`npm install -g pm2`)
- [x] NGINX installed (via aaPanel)
- [x] GitHub repository (sjmedialabs/sjml)
- [x] MongoDB connection string
- [x] Domain pointing to server (sjmedialabs.com)

## 🚀 Initial Setup (First Time Only)

### Step 1: Server Preparation

SSH into your server:
```bash
ssh root@31.97.224.169
```

Install dependencies if not already installed:
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Git (if not installed)
sudo apt-get install -y git
```

### Step 2: Clone Repository

```bash
cd /www/wwwroot
git clone https://github.com/sjmedialabs/sjml.git
cd sjml
```

### Step 3: Environment Setup

Create `.env` file with your credentials:
```bash
nano .env
```

Add these variables:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
TWILIO_WHATSAPP_NUMBER=your_whatsapp_number

# Node Environment
NODE_ENV=production
```

### Step 4: Install Dependencies & Build

```bash
npm ci --production=false
npm run build
```

### Step 5: Start PM2 Processes

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Verify both instances are running:
```bash
pm2 status
```

You should see:
```
┌─────┬──────────────────┬─────────┬──────┐
│ id  │ name             │ status  │ port │
├─────┼──────────────────┼─────────┼──────┤
│ 0   │ sjml-frontend    │ online  │ 3000 │
│ 1   │ sjml-backend     │ online  │ 1001 │
└─────┴──────────────────┴─────────┴──────┘
```

### Step 6: Configure NGINX in aaPanel

1. Login to aaPanel: `http://31.97.224.169:7800`
2. Go to **Website** → Find **sjmedialabs.com** → **Settings**
3. Click **Config File** tab
4. Copy contents from `nginx/sjmedialabs.conf` and paste
5. Click **Save**
6. Test configuration: `nginx -t`
7. Reload NGINX: `nginx -s reload`

See `nginx/AAPANEL_SETUP.md` for detailed instructions.

## 🔄 CI/CD Setup (GitHub Actions)

### Step 1: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

1. **SERVER_HOST**
   ```
   31.97.224.169
   ```

2. **SERVER_USER**
   ```
   root
   ```

3. **SSH_PRIVATE_KEY**
   
   You need to generate SSH key on your local machine and add to server:
   
   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -C "github-actions@sjmedialabs"
   # Save as: github_actions_key
   
   # Copy public key to server
   ssh-copy-id -i ~/.ssh/github_actions_key.pub root@31.97.224.169
   
   # Copy private key content for GitHub secret
   cat ~/.ssh/github_actions_key
   # Copy the entire output including -----BEGIN and -----END lines
   ```
   
   Paste the private key content into GitHub secret.

### Step 2: Test GitHub Actions

Push code to trigger deployment:

```bash
git add .
git commit -m "Setup hybrid deployment with CI/CD"
git push origin main
```

GitHub Actions will automatically:
1. Detect changed files
2. Build the application
3. SSH to server
4. Pull latest code
5. Rebuild
6. Restart appropriate PM2 instance(s)

Monitor progress: GitHub repo → **Actions** tab

## 📝 Manual Deployment Commands

### Deploy Frontend Only
```bash
npm run deploy:frontend
# or
bash scripts/deploy-frontend.sh
```

### Deploy Backend Only
```bash
npm run deploy:backend
# or
bash scripts/deploy-backend.sh
```

### Deploy Everything
```bash
npm run deploy:all
# or
bash scripts/deploy-all.sh
```

### PM2 Management
```bash
npm run pm2:status      # Check status
npm run pm2:logs        # View logs
npm run pm2:restart     # Restart all
npm run pm2:stop        # Stop all
npm run pm2:delete      # Delete all processes
```

## 🔧 Content Update Workflow

### Making Content Changes via Admin

1. Login to admin: `https://sjmedialabs.com/admin/login`
2. Edit content (homepage, services, case studies, etc.)
3. Save changes → MongoDB updated immediately
4. **No rebuild needed!**
5. Changes visible on frontend within 1 hour (ISR revalidation)

### For Immediate Content Updates (Optional)

If you need content changes to appear instantly:

**Option 1: On-Demand Revalidation** (Recommended)
- Implement a webhook or admin button that calls Next.js revalidation API
- See: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

**Option 2: Manual Restart**
```bash
ssh root@31.97.224.169
pm2 restart sjml-frontend
```

### Making Code Changes

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. GitHub Actions automatically deploys (3-5 minutes)
4. OR manually deploy via scripts

## 🧪 Testing Deployment

### Test Frontend
```bash
curl https://sjmedialabs.com
# Should return HTML homepage
```

### Test Backend API
```bash
curl https://sjmedialabs.com/api/content/home
# Should return JSON data
```

### Test Admin Dashboard
```bash
curl https://sjmedialabs.com/admin/login
# Should return admin login page
```

### Test from Browser
- Frontend: https://sjmedialabs.com
- Admin: https://sjmedialabs.com/admin/login
- API: https://sjmedialabs.com/api/content/home

## 🐛 Troubleshooting

### Issue: 502 Bad Gateway

**Symptoms**: Website shows 502 error

**Solution**:
```bash
ssh root@31.97.224.169
pm2 status
# If processes are stopped
pm2 start ecosystem.config.js
```

### Issue: Changes Not Reflecting

**Symptoms**: Pushed code but website still shows old version

**Solution**:
```bash
ssh root@31.97.224.169
cd /www/wwwroot/sjml
git pull origin main
npm ci
npm run build
pm2 restart ecosystem.config.js
```

### Issue: GitHub Actions Failing

**Symptoms**: Deployment workflow fails on GitHub

**Common causes**:
1. SSH key not properly configured
2. Server not accessible
3. Build errors

**Solution**:
- Check GitHub Actions logs for specific error
- Verify SSH_PRIVATE_KEY secret is correct
- Test SSH connection manually:
  ```bash
  ssh -i ~/.ssh/github_actions_key root@31.97.224.169
  ```

### Issue: Port Already in Use

**Symptoms**: PM2 fails to start with "port in use" error

**Solution**:
```bash
# Find and kill process using the port
lsof -ti:3000 | xargs kill -9
lsof -ti:1001 | xargs kill -9

# Restart PM2
pm2 delete all
pm2 start ecosystem.config.js
```

### Issue: NGINX Configuration Error

**Symptoms**: NGINX fails to reload

**Solution**:
```bash
# Test NGINX config
nginx -t

# If errors, check the config file
nano /www/server/panel/vhost/nginx/sjmedialabs.com.conf

# Fix errors and test again
nginx -t

# Reload when valid
nginx -s reload
```

## 📊 Monitoring

### View PM2 Logs
```bash
# All logs
pm2 logs

# Frontend only
pm2 logs sjml-frontend

# Backend only
pm2 logs sjml-backend

# Last 100 lines
pm2 logs --lines 100
```

### View NGINX Logs
```bash
# Access logs
tail -f /www/wwwlogs/sjmedialabs.com.log

# Error logs
tail -f /www/wwwlogs/sjmedialabs.com.error.log
```

### Monitor PM2 in Real-time
```bash
pm2 monit
```

## 🔐 Security Checklist

- [ ] Change default aaPanel password
- [ ] Enable SSL certificate (Let's Encrypt)
- [ ] Ensure .env is in .gitignore
- [ ] Restrict port access (3000, 1001 only localhost)
- [ ] Enable aaPanel firewall
- [ ] Set up automatic MongoDB backups
- [ ] Configure fail2ban for SSH protection
- [ ] Enable PM2 startup script

## 📚 Additional Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [NGINX Configuration Guide](https://nginx.org/en/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Support

For issues or questions:
- Check this documentation first
- Review GitHub Actions logs
- Check PM2 logs: `pm2 logs`
- Check NGINX logs: `tail -f /www/wwwlogs/sjmedialabs.com.error.log`

## 📞 Contact

- Email: info@sjmedialabs.com
- Phone: +91 40 40268570
