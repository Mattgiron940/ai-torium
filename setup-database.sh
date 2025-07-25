#!/bin/bash

# AI-TORIUM Database Setup Script
# This script helps you set up the Supabase database

set -e

echo "🗄️  AI-TORIUM Database Setup"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Supabase Project Setup${NC}"
echo "=============================="

echo "1. Go to https://app.supabase.com"
echo "2. Click 'New Project'"
echo "3. Choose your organization"
echo "4. Project name: ai-torium"
echo "5. Database password: (choose a strong password)"
echo "6. Region: (choose closest to your users)"
echo "7. Click 'Create new project'"
echo ""

read -p "Press Enter when your Supabase project is created..."

echo ""
echo "Now let's get your project details:"
read -p "Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase Service Role Key: " SUPABASE_SERVICE_KEY

echo ""
echo -e "${BLUE}Step 2: Install Supabase CLI${NC}"
echo "============================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install supabase/tap/supabase
        else
            echo "Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://supabase.com/install.sh | sh
    else
        echo "Please install Supabase CLI manually: https://supabase.com/docs/guides/cli"
        exit 1
    fi
else
    echo "Supabase CLI already installed ✅"
fi

echo ""
echo -e "${BLUE}Step 3: Link to Supabase Project${NC}"
echo "================================"

# Login to Supabase
echo "Logging into Supabase..."
supabase login

# Extract project ID from URL
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

echo "Linking to project: $PROJECT_ID"
supabase link --project-ref $PROJECT_ID

echo ""
echo -e "${BLUE}Step 4: Run Database Migrations${NC}"
echo "==============================="

echo "Applying database schema..."

# Check if migrations exist
if [ ! -f "supabase/migrations/001_create_database_schema.sql" ]; then
    echo -e "${RED}Error: Migration files not found. Make sure you're in the ai-torium directory.${NC}"
    exit 1
fi

# Apply migrations using Supabase CLI
echo "Running migration 1: Database schema..."
supabase db push

echo ""
echo -e "${BLUE}Step 5: Configure Authentication${NC}"
echo "================================"

echo "Setting up authentication providers..."
echo ""
echo "Go to your Supabase Dashboard > Authentication > Settings:"
echo "1. Site URL: $SUPABASE_URL"
echo "2. Redirect URLs:"
echo "   - http://localhost:3000/auth/callback"
echo "   - https://your-domain.com/auth/callback"
echo ""

echo "Optional: Set up OAuth providers:"
echo ""
echo "For Google OAuth:"
echo "1. Go to Google Cloud Console"
echo "2. Create OAuth 2.0 credentials"
echo "3. Add to Supabase Auth settings"
echo ""

echo "For GitHub OAuth:"
echo "1. Go to GitHub > Settings > Developer settings > OAuth Apps"
echo "2. Create new OAuth App"
echo "3. Add to Supabase Auth settings"
echo ""

read -p "Press Enter when authentication is configured..."

echo ""
echo -e "${BLUE}Step 6: Test Database Connection${NC}"
echo "==============================="

# Test the connection
echo "Testing database connection..."
supabase db ping

echo ""
echo -e "${BLUE}Step 7: Seed Default Data${NC}"
echo "========================="

echo "The database migrations have already inserted:"
echo "✅ Default subjects (Math, Physics, Chemistry, etc.)"
echo "✅ Database functions for gamification"
echo "✅ Triggers for automatic updates"
echo "✅ RLS policies for security"

echo ""
echo -e "${GREEN}✅ Database Setup Complete!${NC}"
echo "=========================="

echo ""
echo "Your Supabase project is ready with:"
echo "📊 Comprehensive database schema"
echo "🔐 Row-level security policies"
echo "🎮 Gamification system"
echo "📈 Analytics tracking"
echo "💳 Subscription management"
echo "🎯 Lead generation system"

echo ""
echo -e "${YELLOW}Database Tables Created:${NC}"
echo "• users - User profiles and gamification"
echo "• subjects - Learning categories"
echo "• questions - User questions with AI metadata"
echo "• answers - AI-generated responses"
echo "• chat_sessions - Real-time tutoring sessions"
echo "• chat_messages - Chat conversation history"
echo "• subscriptions - Stripe billing integration"
echo "• leads - Outreach and conversion tracking"
echo "• study_sessions - Learning analytics"
echo "• achievements - Badge and reward system"
echo "• learning_paths - Personalized curriculum"
echo "• analytics_events - Detailed user tracking"

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update your .env.local with these Supabase credentials"
echo "2. Test the database connection in your app"
echo "3. Set up Stripe integration"
echo "4. Deploy to production"

echo ""
echo -e "${GREEN}🎉 Your AI-TORIUM database is ready to power intelligent learning!${NC}"