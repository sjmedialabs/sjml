# GitHub Secrets Setup Guide

This guide walks you through setting up GitHub Secrets for automatic CI/CD deployment.

## What You Need

You already have:
- ✅ Server IP: `31.97.224.169`
- ✅ SSH User: `root`
- ✅ SSH Public Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKYaPXsXuCk722dj9Tf+X5twAbECCURK6oJeExDwgy/0 sjmedialabs@github.com`
- ✅ GitHub Repository: `sjmedialabs/sjml`

## Step-by-Step Setup

### Step 1: Generate New SSH Key for GitHub Actions

On your local machine (MacBook), open Terminal and run:

```bash
cd ~/.ssh
ssh-keygen -t ed25519 -C "github-actions@sjmedialabs"
```

When prompted:
- **File name**: Enter `github_actions_deploy`
- **Passphrase**: Leave empty (press Enter twice)

This creates two files:
- `github_actions_deploy` (private key) - for GitHub
- `github_actions_deploy.pub` (public key) - for server

### Step 2: Add Public Key to Server

Copy the public key to your server:

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@31.97.224.169
```

Enter your server password when prompted.

### Step 3: Test SSH Connection

Verify the key works:

```bash
ssh -i ~/.ssh/github_actions_deploy root@31.97.224.169
```

If it logs you in without asking for a password, the key is set up correctly! Type `exit` to logout.

### Step 4: Copy Private Key Content

Get the private key content:

```bash
cat ~/.ssh/github_actions_deploy
```

You'll see output like this:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz
c2gtZWQyNTUxOQAAACBmGj17F7gpO9tnY/U3/pebcAGxAglEauqCXhMQ8IMv9AAA
... (many more lines) ...
-----END OPENSSH PRIVATE KEY-----
```

**Copy the ENTIRE output** including the `-----BEGIN` and `-----END` lines.

### Step 5: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/sjmedialabs/sjml

2. Click **Settings** (top navigation bar)

3. In left sidebar, click **Secrets and variables** → **Actions**

4. Click **New repository secret** button

5. Add these 3 secrets:

#### Secret 1: SERVER_HOST

- **Name**: `SERVER_HOST`
- **Value**: `31.97.224.169`
- Click **Add secret**

#### Secret 2: SERVER_USER

- **Name**: `SERVER_USER`
- **Value**: `root`
- Click **Add secret**

#### Secret 3: SSH_PRIVATE_KEY

- **Name**: `SSH_PRIVATE_KEY`
- **Value**: Paste the entire private key content you copied in Step 4
- Click **Add secret**

### Step 6: Verify Secrets

You should now see 3 secrets listed:
- `SERVER_HOST`
- `SERVER_USER`
- `SSH_PRIVATE_KEY`

The secret values will be hidden (shown as `***`).

## Testing the Setup

### Test 1: Manual Workflow Run

1. Go to your repository → **Actions** tab
2. Click **Deploy Frontend** (or any workflow)
3. Click **Run workflow** dropdown
4. Click green **Run workflow** button
5. Watch the workflow execute

If it succeeds, you're all set! ✅

### Test 2: Push Code to Trigger Auto-Deploy

On your local machine:

```bash
cd /Users/alviongs/Documents/Projects/sjml

# Make a small change (e.g., add a comment to a file)
echo "# CI/CD test" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

Go to GitHub Actions tab and watch the workflow run automatically.

## What Happens When You Push Code?

Depending on which files you changed:

### Frontend Changes
Files in `app/`, `components/`, `styles/`, `public/`
→ Triggers **Deploy Frontend** workflow
→ Restarts `sjml-frontend` PM2 instance

### Backend Changes
Files in `app/admin/`, `app/api/`, `lib/`, `components/admin/`
→ Triggers **Deploy Backend** workflow
→ Restarts `sjml-backend` PM2 instance

### Other Changes
Files in `scripts/`, workflow files
→ Triggers **Deploy All** workflow
→ Restarts both PM2 instances

## Troubleshooting

### Error: "Permission denied (publickey)"

**Cause**: Private key not added correctly to GitHub secrets

**Solution**:
1. Re-copy the private key content (use `cat ~/.ssh/github_actions_deploy`)
2. Make sure you copy the ENTIRE content including BEGIN and END lines
3. Update the `SSH_PRIVATE_KEY` secret in GitHub

### Error: "Host key verification failed"

**Cause**: GitHub Actions can't verify server SSH fingerprint

**Solution**: Add this to your workflow file (already included):
```yaml
script_stop: true
```

### Error: "Connection timed out"

**Cause**: Server firewall blocking GitHub Actions IP

**Solution**:
1. SSH to server: `ssh root@31.97.224.169`
2. Check aaPanel firewall settings
3. Ensure port 22 is open for incoming connections

### Error: Workflow runs but changes don't appear

**Cause**: Build or restart failed on server

**Solution**:
1. Check GitHub Actions logs for specific error
2. SSH to server and check PM2 status: `pm2 status`
3. Check PM2 logs: `pm2 logs`
4. Try manual deployment: `cd /www/wwwroot/sjml && bash scripts/deploy-all.sh`

## Security Notes

🔒 **Keep your private key secure!**
- Never commit private keys to Git
- Never share private keys in chat or email
- GitHub secrets are encrypted and only accessible to workflows

🔑 **SSH Key Best Practices**
- Use separate keys for different purposes
- Rotate keys periodically (every 6-12 months)
- Remove old keys from server when no longer needed

## Next Steps

After setup is complete:

1. ✅ Test deployment by pushing code
2. ✅ Configure NGINX in aaPanel (see `nginx/AAPANEL_SETUP.md`)
3. ✅ Set up SSL certificate for HTTPS
4. ✅ Test content updates via admin dashboard

## Need Help?

- Check GitHub Actions logs: GitHub repo → Actions tab → Click on workflow run
- Check server logs: `ssh root@31.97.224.169 "pm2 logs"`
- Review main deployment guide: `DEPLOYMENT.md`
