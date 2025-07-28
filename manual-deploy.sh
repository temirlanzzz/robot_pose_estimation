#!/bin/bash

echo "🚀 Manual GitHub Pages Deployment"
echo "================================"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check the built files
echo "🔍 Checking built files..."
echo "Built files:"
ls -la dist/
echo ""
echo "Assets:"
ls -la dist/assets/

# Check if index.html has correct paths
echo "🔍 Checking index.html..."
if grep -q "src/main.tsx" dist/index.html; then
    echo "❌ ERROR: index.html still references source files!"
    echo "This means the build didn't work correctly."
    exit 1
else
    echo "✅ index.html looks correct (references built assets)"
fi

# Commit and push
echo "🚀 Deploying to GitHub..."
git add .
git commit -m "Force deploy with correct built assets"
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://temirlanzzz.github.io/robot_pose_estimation"
echo ""
echo "⏳ Please wait 3-5 minutes for GitHub Pages to update."
echo "🔄 If it still doesn't work:"
echo "   1. Go to repository Settings → Pages"
echo "   2. Make sure Source is set to 'Deploy from a branch'"
echo "   3. Select 'gh-pages' branch"
echo "   4. Click Save" 