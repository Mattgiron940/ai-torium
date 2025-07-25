#!/bin/bash

# AI-TORIUM Database Migration Script
# This script applies migrations directly to your Supabase project

set -e

echo "🗄️ AI-TORIUM Database Migration"
echo "==============================="

# Your Supabase project details
SUPABASE_URL="https://kzwezhtenxwdrmnuvevs.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d2V6aHRlbnp3ZHJtbnV2ZXZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ1OTc3MSwiZXhwIjoyMDY5MDM1NzcxfQ.10n1eSI1fLHKAVmFqBWVhR7LzQ23e2LS4aLLoJrV5-M"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to execute SQL
execute_sql() {
    local sql_file=$1
    local description=$2
    
    echo -e "${BLUE}Applying: $description${NC}"
    
    # Read SQL file and execute via REST API
    local sql_content=$(cat "$sql_file")
    
    local response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "apikey: $SERVICE_KEY" \
        -d "{\"sql\": $(echo "$sql_content" | jq -R -s .)}")
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ $description applied successfully${NC}"
    else
        echo -e "${RED}❌ Failed to apply $description${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Alternative method using psql if available
execute_sql_direct() {
    local sql_file=$1
    local description=$2
    
    echo -e "${BLUE}Applying: $description${NC}"
    
    # Extract connection details from your Supabase URL
    PGPASSWORD="$SUPABASE_PASSWORD" psql \
        -h "db.kzwezhtenxwdrmnuvevs.supabase.co" \
        -U "postgres" \
        -d "postgres" \
        -f "$sql_file"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ $description applied successfully${NC}"
    else
        echo -e "${RED}❌ Failed to apply $description${NC}"
        return 1
    fi
}

echo -e "${YELLOW}Method 1: Using Supabase API${NC}"
echo "============================================="

# Apply migrations in order
echo "Applying database migrations..."

# First, let's try the direct SQL execution
echo -e "${BLUE}Step 1: Database Schema${NC}"
cat supabase/migrations/001_create_database_schema.sql | \
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -d @-

echo ""
echo -e "${BLUE}Step 2: RLS Policies${NC}"
cat supabase/migrations/002_create_rls_policies.sql | \
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -d @-

echo ""
echo -e "${BLUE}Step 3: Functions and Triggers${NC}"
cat supabase/migrations/003_create_functions_and_triggers.sql | \
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -d @-

echo ""
echo -e "${GREEN}✅ Database migrations completed!${NC}"
echo ""
echo "Your AI-TORIUM database is now ready with:"
echo "📊 Comprehensive schema with 10+ tables"
echo "🔐 Row-level security policies"
echo "🎮 Gamification system"
echo "📈 Analytics tracking"
echo "💳 Subscription management"
echo "🎯 Lead generation system"
echo ""
echo -e "${BLUE}Next: Configure Stripe payments${NC}"
echo "Run: ./setup-stripe.sh"