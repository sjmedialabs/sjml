# aaPanel NGINX Configuration Setup

This guide explains how to configure NGINX in aaPanel for the hybrid frontend/backend split.

## Architecture Overview

```
sjmedialabs.com          → Frontend (port 3000) - Marketing pages
sjmedialabs.com/admin    → Backend (port 1001) - Admin dashboard
sjmedialabs.com/api      → Backend (port 1001) - API routes
```

## Step-by-Step Setup in aaPanel

### 1. Access aaPanel

- Login to aaPanel: `http://31.97.224.169:7800`
- Navigate to **Website** section

### 2. Locate Your Site Configuration

- Find **sjmedialabs.com** in the website list
- Click **Settings** (gear icon)
- Go to **Config File** tab

### 3. Update NGINX Configuration

**Option A: Replace entire config**
- Copy the contents of `nginx/sjmedialabs.conf`
- Paste into the config editor
- Click **Save**

**Option B: Add proxy rules manually**

Add these location blocks to your existing config:

```nginx
# Backend routes - Admin
location /admin {
    proxy_pass http://127.0.0.1:1001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# Backend routes - API
location /api {
    proxy_pass http://127.0.0.1:1001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# Frontend routes - Marketing pages
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### 4. Test NGINX Configuration

In aaPanel terminal or SSH:

```bash
nginx -t
```

You should see:
```
nginx: configuration file /www/server/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /www/server/nginx/conf/nginx.conf test is successful
```

### 5. Reload NGINX

```bash
# In aaPanel terminal
nginx -s reload

# OR restart via aaPanel UI
# Go to Software Store → NGINX → Restart
```

### 6. Verify PM2 Processes

```bash
pm2 status
```

You should see:
```
┌─────┬──────────────────┬─────────┬────────┐
│ id  │ name             │ status  │ port   │
├─────┼──────────────────┼─────────┼────────┤
│ 0   │ sjml-frontend    │ online  │ 3000   │
│ 1   │ sjml-backend     │ online  │ 1001   │
└─────┴──────────────────┴─────────┴────────┘
```

## Testing the Setup

### Test Frontend (Marketing Pages)
```bash
curl http://sjmedialabs.com
# Should return homepage HTML
```

### Test Backend API
```bash
curl http://sjmedialabs.com/api/content/home
# Should return JSON data
```

### Test Admin Dashboard
```bash
curl http://sjmedialabs.com/admin/login
# Should return admin login page HTML
```

## Troubleshooting

### Issue: 502 Bad Gateway

**Cause**: PM2 processes not running

**Solution**:
```bash
cd /www/wwwroot/sjml
pm2 start ecosystem.config.js
pm2 save
```

### Issue: Port already in use

**Cause**: Old PM2 process still running on port

**Solution**:
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Issue: Changes not reflecting

**Cause**: NGINX cache or old build

**Solution**:
```bash
# Clear PM2 logs
pm2 flush

# Rebuild and restart
cd /www/wwwroot/sjml
npm run build
pm2 restart ecosystem.config.js

# Clear NGINX cache
nginx -s reload
```

### Issue: Cannot access admin

**Cause**: NGINX not proxying /admin correctly

**Solution**: Check NGINX config has the `/admin` location block before the `/` location block. Order matters!

## aaPanel Firewall

Ensure these ports are open:
- **80** (HTTP)
- **443** (HTTPS)
- **3000** (Frontend - should NOT be public, only localhost)
- **1001** (Backend - should NOT be public, only localhost)

In aaPanel:
1. Go to **Security**
2. Ensure ports 80 and 443 are allowed
3. Block direct access to 3000 and 1001 (they should only be accessible via NGINX proxy)

## SSL Certificate Setup (Optional)

To enable HTTPS:

1. In aaPanel, go to your site → **SSL**
2. Use Let's Encrypt to get free SSL certificate
3. After SSL is enabled, update the NGINX config to use port 443
4. Uncomment the SSL lines in `sjmedialabs.conf`

## Additional Notes

- **Frontend (port 3000)**: Serves marketing pages with ISR (1-hour cache)
- **Backend (port 1001)**: Serves admin dashboard and API with dynamic rendering
- Content updates via admin are instant (no rebuild needed)
- Code changes require `git pull` + `npm run build` + `pm2 restart`
