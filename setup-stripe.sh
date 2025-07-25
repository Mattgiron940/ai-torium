#!/bin/bash

# AI-TORIUM Stripe Setup Script
# This script helps you configure Stripe for payments

set -e

echo "💳 AI-TORIUM Stripe Setup"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Stripe Account Setup${NC}"
echo "==========================="

echo "1. Go to https://dashboard.stripe.com"
echo "2. Create a Stripe account or sign in"
echo "3. Complete your account setup"
echo "4. Activate your account for live payments"
echo ""

read -p "Press Enter when your Stripe account is ready..."

echo ""
echo -e "${BLUE}Step 2: Install Stripe CLI${NC}"
echo "=========================="

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "Installing Stripe CLI..."
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install stripe/stripe-cli/stripe
        else
            echo "Please install Homebrew first: https://brew.sh"
            echo "Or download Stripe CLI from: https://stripe.com/docs/stripe-cli"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://packages.stripe.dev/stripe-cli-install.sh | sh
    else
        echo "Please install Stripe CLI manually: https://stripe.com/docs/stripe-cli"
        exit 1
    fi
else
    echo "Stripe CLI already installed ✅"
fi

echo ""
echo -e "${BLUE}Step 3: Login to Stripe${NC}"
echo "======================"

stripe login

echo ""
echo -e "${BLUE}Step 4: Create Subscription Products${NC}"
echo "===================================="

echo "Creating AI-TORIUM subscription products..."

# Create Premium product
echo "Creating Premium plan..."
PREMIUM_PRODUCT=$(stripe products create \
  --name="AI-TORIUM Premium" \
  --description="Unlimited questions, AI tutoring, OCR uploads, and priority support" \
  --format=json | jq -r .id)

echo "Premium product created: $PREMIUM_PRODUCT"

# Create Premium prices
PREMIUM_MONTHLY=$(stripe prices create \
  --product=$PREMIUM_PRODUCT \
  --currency=usd \
  --unit-amount=1999 \
  --recurring="interval=month" \
  --nickname="Premium Monthly" \
  --format=json | jq -r .id)

PREMIUM_YEARLY=$(stripe prices create \
  --product=$PREMIUM_PRODUCT \
  --currency=usd \
  --unit-amount=19999 \
  --recurring="interval=year" \
  --nickname="Premium Yearly" \
  --format=json | jq -r .id)

echo "Premium monthly price: $PREMIUM_MONTHLY"
echo "Premium yearly price: $PREMIUM_YEARLY"

# Create Pro product
echo "Creating Pro plan..."
PRO_PRODUCT=$(stripe products create \
  --name="AI-TORIUM Pro" \
  --description="Everything in Premium plus unlimited AI tutoring, voice features, and expert sessions" \
  --format=json | jq -r .id)

echo "Pro product created: $PRO_PRODUCT"

# Create Pro prices
PRO_MONTHLY=$(stripe prices create \
  --product=$PRO_PRODUCT \
  --currency=usd \
  --unit-amount=3999 \
  --recurring="interval=month" \
  --nickname="Pro Monthly" \
  --format=json | jq -r .id)

PRO_YEARLY=$(stripe prices create \
  --product=$PRO_PRODUCT \
  --currency=usd \
  --unit-amount=39999 \
  --recurring="interval=year" \
  --nickname="Pro Yearly" \
  --format=json | jq -r .id)

echo "Pro monthly price: $PRO_MONTHLY"
echo "Pro yearly price: $PRO_YEARLY"

echo ""
echo -e "${GREEN}✅ Subscription products created!${NC}"

echo ""
echo -e "${BLUE}Step 5: Update Price IDs in Code${NC}"
echo "================================"

# Update the stripe.ts file with the new price IDs
if [ -f "src/lib/stripe.ts" ]; then
    echo "Updating price IDs in src/lib/stripe.ts..."
    
    # Create a backup
    cp src/lib/stripe.ts src/lib/stripe.ts.backup
    
    # Update Premium price IDs
    sed -i.tmp "s/stripePriceIdMonthly: 'price_premium_monthly'/stripePriceIdMonthly: '$PREMIUM_MONTHLY'/g" src/lib/stripe.ts
    sed -i.tmp "s/stripePriceIdYearly: 'price_premium_yearly'/stripePriceIdYearly: '$PREMIUM_YEARLY'/g" src/lib/stripe.ts
    
    # Update Pro price IDs
    sed -i.tmp "s/stripePriceIdMonthly: 'price_pro_monthly'/stripePriceIdMonthly: '$PRO_MONTHLY'/g" src/lib/stripe.ts
    sed -i.tmp "s/stripePriceIdYearly: 'price_pro_yearly'/stripePriceIdYearly: '$PRO_YEARLY'/g" src/lib/stripe.ts
    
    # Clean up temp files
    rm src/lib/stripe.ts.tmp
    
    echo "✅ Price IDs updated in stripe.ts"
else
    echo "⚠️  Could not find src/lib/stripe.ts - please update manually"
fi

echo ""
echo -e "${BLUE}Step 6: Set Up Webhooks${NC}"
echo "======================"

echo "Setting up webhook endpoints..."

# Get the app URL
read -p "Enter your app URL (e.g., https://ai-torium.vercel.app): " APP_URL

# Create webhook endpoint
WEBHOOK_ENDPOINT=$(stripe webhook_endpoints create \
  --url="$APP_URL/api/stripe/webhook" \
  --enabled-events="checkout.session.completed,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.updated,customer.subscription.deleted" \
  --description="AI-TORIUM payment webhooks" \
  --format=json | jq -r .id)

# Get webhook signing secret
WEBHOOK_SECRET=$(stripe webhook_endpoints retrieve $WEBHOOK_ENDPOINT --format=json | jq -r .secret)

echo "Webhook endpoint created: $WEBHOOK_ENDPOINT"
echo "Webhook secret: $WEBHOOK_SECRET"

echo ""
echo -e "${BLUE}Step 7: Get API Keys${NC}"
echo "==================="

# Get publishable key
PUBLISHABLE_KEY=$(stripe keys list --format=json | jq -r '.data[] | select(.type=="publishable") | .key')

echo "Your Stripe keys:"
echo "Publishable key: $PUBLISHABLE_KEY"
echo "Secret key: (get from Stripe dashboard > Developers > API keys)"
echo "Webhook secret: $WEBHOOK_SECRET"

echo ""
echo -e "${BLUE}Step 8: Environment Variables${NC}"
echo "============================="

echo "Add these to your environment variables:"
echo ""
echo "STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY"
echo "STRIPE_SECRET_KEY=sk_live_... (get from Stripe dashboard)"
echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET"

# Save to a file for reference
cat > stripe-config.txt << EOF
# AI-TORIUM Stripe Configuration
# Generated on $(date)

# Products
PREMIUM_PRODUCT_ID=$PREMIUM_PRODUCT
PRO_PRODUCT_ID=$PRO_PRODUCT

# Price IDs
PREMIUM_MONTHLY_PRICE=$PREMIUM_MONTHLY
PREMIUM_YEARLY_PRICE=$PREMIUM_YEARLY
PRO_MONTHLY_PRICE=$PRO_MONTHLY
PRO_YEARLY_PRICE=$PRO_YEARLY

# API Keys
STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_... (get from dashboard)
STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET

# Webhook
WEBHOOK_ENDPOINT_ID=$WEBHOOK_ENDPOINT
WEBHOOK_URL=$APP_URL/api/stripe/webhook

# Pricing (for reference)
Premium: $19.99/month or $199.99/year (17% savings)
Pro: $39.99/month or $399.99/year (17% savings)
EOF

echo "Configuration saved to stripe-config.txt"

echo ""
echo -e "${BLUE}Step 9: Test Webhooks (Optional)${NC}"
echo "=================================="

echo "To test webhooks locally:"
echo "1. Run your Next.js app: npm run dev"
echo "2. In another terminal, run: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "3. Test a payment flow"

echo ""
echo -e "${BLUE}Step 10: Go Live${NC}"
echo "================="

echo "To activate live payments:"
echo "1. Complete your Stripe account verification"
echo "2. Switch from test mode to live mode in Stripe dashboard"
echo "3. Update your environment variables with live keys"
echo "4. Test the payment flow thoroughly"

echo ""
echo -e "${GREEN}✅ Stripe Setup Complete!${NC}"
echo "========================"

echo ""
echo "Your AI-TORIUM Stripe integration is ready with:"
echo "💳 Premium plan: $19.99/month or $199.99/year"
echo "🚀 Pro plan: $39.99/month or $399.99/year"
echo "🔗 Webhook endpoint configured"
echo "🔐 Secure payment processing"
echo "📊 Subscription management"

echo ""
echo -e "${YELLOW}Important Files:${NC}"
echo "📄 stripe-config.txt - Your configuration details"
echo "📄 src/lib/stripe.ts - Updated with your price IDs"
echo "📄 src/lib/stripe.ts.backup - Backup of original file"

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Add the environment variables to Vercel/your hosting platform"
echo "2. Test the subscription flow"
echo "3. Verify webhook delivery"
echo "4. Monitor transactions in Stripe dashboard"

echo ""
echo -e "${GREEN}🎉 Your AI-TORIUM platform can now accept payments!${NC}"