#!/bin/bash

# AI-TORIUM GitHub Setup and Deployment Script
# This script will help you push to GitHub and connect all services

set -e

echo "🚀 AI-TORIUM GitHub Setup and Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the ai-torium directory.${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Git Repository Setup${NC}"
echo "================================"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo "Git repository initialized ✅"
else
    echo "Git repository already exists ✅"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/
.next
out

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Supabase
.supabase/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.production

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/
EOF
    echo ".gitignore created ✅"
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "No changes to commit"
else
    # Commit the initial version
    echo "Committing initial version..."
    git commit -m "🚀 Initial commit: Complete AI-TORIUM platform

✨ Features implemented:
- Next.js 14 with TypeScript and Tailwind CSS
- Supabase database with comprehensive schema
- Claude AI integration for tutoring
- Stripe subscription system with 3 tiers
- Real-time AI chat with streaming responses
- OCR processing for image uploads
- Gamification system (points, levels, badges)
- Automated lead generation and outreach
- Admin dashboard for campaign management
- Complete authentication system
- Responsive design for all devices

🛠 Tech Stack:
- Frontend: Next.js, React, TypeScript, Tailwind
- Backend: Supabase, Claude API, Stripe
- Deployment: Vercel with Edge Functions
- Database: PostgreSQL with RLS policies

🎯 Ready for production deployment!"
    echo "Initial commit created ✅"
fi

echo ""
echo -e "${YELLOW}Step 2: GitHub Repository Creation${NC}"
echo "=================================="
echo "Please follow these steps to create your GitHub repository:"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Repository name: ai-torium"
echo "3. Description: Advanced AI-powered learning platform with Claude AI integration"
echo "4. Choose Public or Private"
echo "5. DO NOT initialize with README, .gitignore, or license (we already have these)"
echo "6. Click 'Create repository'"
echo ""

read -p "Press Enter when you've created the GitHub repository..."

echo ""
echo "Now enter your GitHub repository details:"
read -p "GitHub username: " GITHUB_USERNAME
read -p "Repository name (default: ai-torium): " REPO_NAME
REPO_NAME=${REPO_NAME:-ai-torium}

# Add GitHub remote
GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "Adding GitHub remote: $GITHUB_URL"

if git remote | grep -q "origin"; then
    git remote set-url origin $GITHUB_URL
else
    git remote add origin $GITHUB_URL
fi

# Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

echo ""
echo -e "${BLUE}Step 3: Vercel Deployment Setup${NC}"
echo "================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "Setting up Vercel deployment..."
echo "1. Make sure you're logged into Vercel CLI"
echo "2. We'll import your GitHub repository to Vercel"

# Login to Vercel
echo "Logging into Vercel..."
vercel login

# Link the project
echo "Linking project to Vercel..."
vercel link

echo ""
echo -e "${BLUE}Step 4: Environment Variables Setup${NC}"
echo "==================================="

echo "Setting up environment variables for Vercel..."
echo "You'll need to provide the following API keys:"

# Function to set Vercel environment variable
set_vercel_env() {
    local key=$1
    local description=$2
    local required=${3:-false}
    
    echo ""
    echo -e "${YELLOW}Setting up: $key${NC}"
    echo "Description: $description"
    
    if [ "$required" = "true" ]; then
        echo -e "${RED}⚠️  This is REQUIRED for the platform to work${NC}"
    fi
    
    read -p "Enter value for $key (or press Enter to skip): " value
    
    if [ ! -z "$value" ]; then
        vercel env add $key production <<< "$value"
        vercel env add $key preview <<< "$value"
        vercel env add $key development <<< "$value"
        echo -e "${GREEN}✅ $key configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped $key${NC}"
    fi
}

# Set up environment variables
set_vercel_env "NEXT_PUBLIC_SUPABASE_URL" "Supabase project URL" true
set_vercel_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase anonymous key" true
set_vercel_env "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key" true
set_vercel_env "ANTHROPIC_API_KEY" "Claude AI API key" true
set_vercel_env "STRIPE_PUBLISHABLE_KEY" "Stripe publishable key" true
set_vercel_env "STRIPE_SECRET_KEY" "Stripe secret key" true
set_vercel_env "STRIPE_WEBHOOK_SECRET" "Stripe webhook secret" true
set_vercel_env "NEXT_PUBLIC_APP_URL" "Your app URL (e.g., https://ai-torium.vercel.app)"
set_vercel_env "MATHPIX_APP_ID" "Mathpix app ID (optional)" false
set_vercel_env "MATHPIX_APP_KEY" "Mathpix app key (optional)" false
set_vercel_env "TEXTR_API_KEY" "TEXTR.AI API key (optional)" false
set_vercel_env "ADMIN_API_KEY" "Admin API key for outreach (create your own)" false

echo ""
echo -e "${BLUE}Step 5: Deploy to Vercel${NC}"
echo "========================"

echo "Deploying to Vercel..."
vercel --prod

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================="

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls | grep $REPO_NAME | awk '{print $2}' | head -1)

echo ""
echo -e "${GREEN}✅ AI-TORIUM Platform Successfully Deployed!${NC}"
echo ""
echo "📍 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "🌐 Live URL: https://$DEPLOYMENT_URL"
echo "⚙️  Vercel Dashboard: https://vercel.com/dashboard"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "1. Set up your Supabase database (run the SQL migrations)"
echo "2. Configure Stripe products and webhooks"
echo "3. Test the authentication flow"
echo "4. Configure your custom domain (optional)"
echo ""

echo -e "${YELLOW}Important Setup Links:${NC}"
echo "📊 Supabase Dashboard: https://app.supabase.com"
echo "💳 Stripe Dashboard: https://dashboard.stripe.com"
echo "🔧 Vercel Dashboard: https://vercel.com/dashboard"
echo ""

echo -e "${GREEN}🚀 Your AI-powered learning platform is now live!${NC}"