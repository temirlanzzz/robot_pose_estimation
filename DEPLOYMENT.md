# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your Robot Pose Visualizer to GitHub Pages.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Git Repository**: Your project should be in a GitHub repository
3. **Repository Name**: The repository should be named `robot_pose_estimation` (or update the base path in `vite.config.ts`)

## 🔧 Setup Steps

### 1. Create GitHub Repository

If you haven't already, create a new repository on GitHub:

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `pose_estimation`
4. Make it public (required for free GitHub Pages)
5. Don't initialize with README (we already have one)

### 2. Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Robot Pose Visualizer"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/robot_pose_estimation.git

# Push to main branch
git push -u origin main
```

### 3. Update Configuration

**Important**: Update the `homepage` field in `package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/robot_pose_estimation"
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch
6. Click "Save"

### 5. Deploy

#### Option A: Manual Deployment

```bash
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

#### Option B: Automatic Deployment (Recommended)

The GitHub Actions workflow will automatically deploy when you push to the main branch:

```bash
# Just push your changes
git add .
git commit -m "Update app"
git push origin main
```

## 🔄 Continuous Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

1. **Build** your app when you push to main branch
2. **Deploy** automatically to GitHub Pages
3. **Update** the site with your latest changes

## 🌐 Access Your Site

Once deployed, your site will be available at:
```
https://YOUR_USERNAME.github.io/robot_pose_estimation
```

## 🛠️ Troubleshooting

### Common Issues

1. **404 Error**: Make sure the base path in `vite.config.ts` matches your repository name
2. **Build Failures**: Check the Actions tab in your GitHub repository for error logs
3. **Assets Not Loading**: Ensure all paths are relative and the base path is correct

### Manual Build Test

Test your build locally before deploying:

```bash
npm run build
npm run preview
```

### Check Deployment Status

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Check the latest workflow run
4. Look for any error messages

## 📝 Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public` folder:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings
3. Update the `homepage` in `package.json`

## 🔧 Environment Variables

For different environments, you can create environment files:

- `.env.local` for local development
- `.env.production` for production builds

## 📊 Monitoring

- **GitHub Pages**: Check the Pages section in repository settings
- **Actions**: Monitor deployment status in the Actions tab
- **Analytics**: Add Google Analytics or other tracking if needed

---

**Your Robot Pose Visualizer will be live at: `https://YOUR_USERNAME.github.io/robot_pose_estimation`** 🎉 