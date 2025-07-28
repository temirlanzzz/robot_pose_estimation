# 🚀 Deployment Guide - Robot Pose Visualizer

This guide covers multiple deployment options for your Robot Pose Visualizer application.

## 📋 Deployment Options

1. **GitHub Pages** (Free, Static Hosting)
2. **Docker** (Self-hosted, Full Control)
3. **Vercel/Netlify** (Modern Hosting Platforms)

---

## 🌐 Option 1: GitHub Pages (Recommended for Demo)

### Current Issue & Fix

**Problem**: Assets not loading correctly
```
GET https://temirlanzzz.github.io/src/main.tsx net::ERR_ABORTED 404
GET https://temirlanzzz.github.io/robot-icon.svg 404
```

**Solution**: The Vite configuration has been updated to handle asset paths correctly.

### Steps to Fix GitHub Pages

1. **Rebuild and Deploy**:
   ```bash
   npm run build
   git add .
   git commit -m "Fix asset paths for GitHub Pages"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to your repository → Actions tab
   - Ensure the workflow completes successfully
   - Check that assets are properly built

3. **Verify Deployment**:
   - Wait 2-3 minutes for GitHub Pages to update
   - Clear browser cache and try again
   - Check browser developer tools for any remaining 404 errors

### Alternative: Manual GitHub Pages Fix

If the automatic deployment still has issues:

```bash
# Build locally
npm run build

# Check the dist folder structure
ls -la dist/

# Deploy manually
npm run deploy
```

---

## 🐳 Option 2: Docker Deployment (Recommended for Production)

### Why Docker?

✅ **Advantages**:
- Full control over the environment
- Consistent deployment across platforms
- Better performance and caching
- No asset path issues
- Easy to scale and manage

### Quick Start with Docker

#### 1. Build and Run Locally
```bash
# Build the Docker image
docker build -t robot-pose-visualizer .

# Run the container
docker run -p 3000:80 robot-pose-visualizer

# Access at http://localhost:3000
```

#### 2. Using Docker Compose
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### 3. Development with Docker
```bash
# Start development environment
docker-compose --profile dev up -d

# Access development server at http://localhost:3001
```

### Deploy to Cloud Platforms

#### Deploy to DigitalOcean App Platform
```bash
# Build and push to registry
docker tag robot-pose-visualizer your-registry/robot-pose-visualizer
docker push your-registry/robot-pose-visualizer
```

#### Deploy to AWS ECS
```bash
# Create ECS cluster and deploy
aws ecs create-cluster --cluster-name robot-pose-cluster
# ... (follow AWS ECS deployment guide)
```

#### Deploy to Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT/robot-pose-visualizer
gcloud run deploy robot-pose-visualizer --image gcr.io/YOUR_PROJECT/robot-pose-visualizer
```

---

## ⚡ Option 3: Modern Hosting Platforms

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### Netlify Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (drag dist folder to Netlify dashboard)
# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

---

## 🔧 Troubleshooting

### GitHub Pages Issues

1. **Assets Not Loading**:
   - Check browser cache (Ctrl+F5)
   - Verify base path in `vite.config.ts`
   - Check GitHub Actions build logs

2. **404 Errors**:
   - Ensure repository is public
   - Check GitHub Pages settings
   - Verify workflow permissions

### Docker Issues

1. **Build Failures**:
   ```bash
   # Clean build
   docker system prune -a
   docker build --no-cache -t robot-pose-visualizer .
   ```

2. **Port Conflicts**:
   ```bash
   # Use different port
   docker run -p 8080:80 robot-pose-visualizer
   ```

3. **Permission Issues**:
   ```bash
   # Run with proper permissions
   docker run --user $(id -u):$(id -g) -p 3000:80 robot-pose-visualizer
   ```

---

## 📊 Performance Comparison

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **GitHub Pages** | Free, Easy setup | Limited features, Asset issues | Demos, Static sites |
| **Docker** | Full control, Consistent | More complex setup | Production, Custom needs |
| **Vercel/Netlify** | Modern, Fast | Vendor lock-in | Modern web apps |

---

## 🎯 Recommendation

### For Demo/Portfolio: GitHub Pages
- Free and easy
- Good for showcasing work
- Quick deployment

### For Production: Docker
- Full control
- Better performance
- Scalable
- No asset path issues

### For Modern Web App: Vercel/Netlify
- Excellent performance
- Modern features
- Easy deployment

---

## 🚀 Quick Commands

```bash
# GitHub Pages
npm run deploy

# Docker Production
docker-compose up -d

# Docker Development
docker-compose --profile dev up -d

# Vercel
vercel

# Netlify
netlify deploy --prod --dir=dist
```

---

**Choose the deployment method that best fits your needs!** 🎉 