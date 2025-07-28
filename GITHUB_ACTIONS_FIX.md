# 🔧 GitHub Actions Permission Fix

## The Issue
You're getting this error:
```
remote: Permission to temirlanzzz/robot_pose_estimation.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/temirlanzzz/robot_pose_estimation.git/': The requested URL returned error: 403
```

## ✅ Solution

The workflow has been updated to use the modern GitHub Pages deployment method. Here's what you need to do:

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository: `https://github.com/temirlanzzz/robot_pose_estimation`
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **"GitHub Actions"**
5. Click **Save**

### 2. Grant Permissions (if needed)

If you still get permission errors:

1. Go to **Settings** → **Actions** → **General**
2. Scroll down to **Workflow permissions**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### 3. Push Your Changes

```bash
git add .
git commit -m "Fix GitHub Actions workflow"
git push origin main
```

## 🔄 What Changed

The workflow now uses:
- **Modern GitHub Pages Actions**: `actions/deploy-pages@v4`
- **Proper Permissions**: Explicit permission configuration
- **Artifact Upload**: Uses `actions/upload-pages-artifact@v3`
- **Environment Configuration**: Proper GitHub Pages environment setup

## 🌐 Your Site URL

Once deployed, your site will be available at:
```
https://temirlanzzz.github.io/robot_pose_estimation
```

## 📊 Monitor Deployment

1. Go to your repository
2. Click **Actions** tab
3. Check the latest workflow run
4. Look for any error messages

## 🚨 Troubleshooting

### If you still get errors:

1. **Check Repository Settings**:
   - Ensure Pages is enabled with "GitHub Actions" source
   - Verify repository is public (required for free GitHub Pages)

2. **Check Workflow Permissions**:
   - Go to Settings → Actions → General
   - Enable "Read and write permissions"

3. **Manual Deployment** (if needed):
   ```bash
   npm run deploy
   ```

4. **Check Build Logs**:
   - Go to Actions tab
   - Click on the failed workflow
   - Check the build step for errors

## ✅ Success Indicators

When successful, you should see:
- ✅ Green checkmark in Actions tab
- 🌐 Site accessible at the URL above
- 📝 Deployment logs showing successful upload

---

**The updated workflow should resolve the permission issues!** 🎉 