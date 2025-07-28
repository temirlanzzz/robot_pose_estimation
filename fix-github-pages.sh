#!/bin/bash

echo "🔧 Fixing GitHub Pages Deployment"
echo "================================"

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if the built files are correct
echo "🔍 Checking built files..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ dist/index.html not found!"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    echo "❌ dist/assets directory not found!"
    exit 1
fi

echo "✅ Built files look correct!"

# Commit and push changes
echo "🚀 Deploying to GitHub Pages..."
git add .
git commit -m "Fix GitHub Pages asset paths and deployment"
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://temirlanzzz.github.io/robot_pose_estimation"
echo ""
echo "⏳ Please wait 2-3 minutes for GitHub Pages to update."
echo "🔄 If the site still doesn't work, try:"
echo "   1. Clear browser cache (Ctrl+F5)"
echo "   2. Check GitHub Actions tab for build status"
echo "   3. Verify GitHub Pages is enabled in repository settings" 