# EC2 Deployment Guide

This guide will help you deploy your Node.js SQLite API to AWS EC2 using GitHub Actions.

## Prerequisites

- AWS EC2 instance running Ubuntu/Amazon Linux
- GitHub repository with your code
- SSH access to your EC2 instance

## Step 1: Setup EC2 Instance

### Install Node.js and PM2

SSH into your EC2 instance and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install build essentials (required for better-sqlite3)
sudo apt-get install -y build-essential python3
```

### Clone Your Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git node-sqlite-api
cd node-sqlite-api
npm install
npm run build
```

### Setup PM2 to Run on Boot

```bash
pm2 startup
pm2 save
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository settings:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these three secrets:

### 1. EC2_HOST
Your EC2 instance public IP or domain
```
Example: 54.123.456.789
```

### 2. EC2_USERNAME
Your SSH username (usually `ubuntu` or `ec2-user`)
```
Example: ubuntu
```

### 3. EC2_SSH_KEY
Your EC2 private key (`.pem` file content)

```bash
# On your local machine, copy the content of your .pem file:
cat /path/to/your-key.pem
```

Copy the entire output (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) and paste it as the secret value.

### Verify path and branch on EC2

The workflow runs `cd /home/<username>/<APP_DIR>` and `git pull origin <BRANCH>`. Make sure these match your EC2:

**On your EC2 instance (SSH in), run:**

```bash
echo $HOME
# → e.g. /home/ubuntu

ls ~
# → note the app folder name (e.g. node-sqlite-api or deploy-node-ec2-workflow)

cd ~/YOUR_APP_FOLDER
git branch
# → note the branch (e.g. master or main)
```

**If your folder or branch is different**, set repository variables so the workflow uses them:

**Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**

| Name     | Value example              | When to set |
|----------|----------------------------|-------------|
| `APP_DIR`| `deploy-node-ec2-workflow` | If your app is not in `~/node-sqlite-api` |
| `BRANCH` | `main`                     | If your default branch is not `master`     |

Defaults (if you don't set variables): `APP_DIR` = `node-sqlite-api`, `BRANCH` = `master`.

## Step 3: Security Group Configuration

Make sure your EC2 Security Group allows:
- **Port 22** (SSH) - from GitHub Actions IP ranges or your IP
- **Port 3000** (App) - from anywhere (0.0.0.0/0) or specific IPs

## Step 4: Deploy

The workflow will automatically deploy when you:
- Push to the `master` branch
- Manually trigger from GitHub Actions tab

### Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **Deploy to EC2** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Workflow Explanation

```yaml
# Triggers on push to master or manual trigger
on:
  push:
    branches: [master]
  workflow_dispatch:

# Uses official GitHub actions
- actions/checkout@v4          # Checkout code
- appleboy/ssh-action@v1.0.3   # SSH into EC2

# Deployment steps on EC2:
1. Navigate to app directory
2. Pull latest code from git
3. Install production dependencies
4. Build TypeScript code
5. Restart app with PM2
```

## Verify Deployment

After deployment, test your API:

```bash
curl http://YOUR_EC2_IP:3000
```

You should see the welcome message with API endpoints.

## Troubleshooting

### Check PM2 Logs
```bash
pm2 logs node-sqlite-api
```

### Check PM2 Status
```bash
pm2 status
```

### Restart Manually
```bash
pm2 restart node-sqlite-api
```

### View Build Output
Check the GitHub Actions logs in the **Actions** tab of your repository.

## Optional: Setup Nginx Reverse Proxy

For production, use Nginx to proxy to your app:

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

Update Security Group to allow **Port 80** (HTTP).

## Notes

- The SQLite database will persist in the app directory on EC2
- PM2 will automatically restart the app if it crashes
- Logs are managed by PM2 (check with `pm2 logs`)
