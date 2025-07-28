#!/bin/bash

# GitHub Pages Deployment Script
# This script helps you deploy your Robot Pose Visualizer to GitHub Pages

echo "🤖 Robot Pose Visualizer - GitHub Pages Deployment"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set. Please run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/robot_pose_estimation.git"
    echo "   (Replace YOUR_USERNAME with your GitHub username)"
    exit 1
fi

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your site will be available at:"
    echo "   https://YOUR_USERNAME.github.io/robot_pose_estimation"
    echo ""
    echo "📝 Remember to:"
    echo "   1. Update the homepage in package.json with your GitHub username"
    echo "   2. Enable GitHub Pages in your repository settings"
    echo "   3. Wait a few minutes for the site to be available"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 