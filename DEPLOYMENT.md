# AI-TORIUM Deployment Guide

This guide covers the complete deployment process for the AI-TORIUM platform.

## Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key
- Stripe account (for payments)
- Vercel account (for deployment)

## Step-by-Step Deployment

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ai-torium
npm install
```

### 2. Environment Configuration

Copy the environment template:
```bash
cp .env.local.example .env.local
```

Fill in the required environment variables:

#### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=sk-ant-your-key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Database Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the project URL and anon key

#### Run Database Migrations
Execute the SQL files in order:
1. `supabase/migrations/001_create_database_schema.sql`
2. `supabase/migrations/002_create_rls_policies.sql`
3. `supabase/migrations/003_create_functions_and_triggers.sql`

#### Configure Authentication
1. Go to Supabase Dashboard > Authentication > Settings
2. Enable Google OAuth (optional)
3. Enable GitHub OAuth (optional)
4. Configure redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 4. Stripe Configuration

#### Create Products and Prices
```bash
# Install Stripe CLI
stripe login

# Create Premium plan
stripe products create --name="Premium" --description="AI-TORIUM Premium Plan"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=1999 --recurring="interval=month"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=19999 --recurring="interval=year"

# Create Pro plan
stripe products create --name="Pro" --description="AI-TORIUM Pro Plan"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=3999 --recurring="interval=month"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=39999 --recurring="interval=year"
```

#### Update Price IDs
Update the price IDs in `src/lib/stripe.ts`:
```typescript
stripePriceIdMonthly: 'price_your_monthly_id',
stripePriceIdYearly: 'price_your_yearly_id',
```

#### Configure Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Vercel Deployment

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy to Vercel
```bash
vercel --prod
```

#### Configure Environment Variables
In Vercel Dashboard, add all environment variables from your `.env.local` file.

#### Configure Custom Domain (Optional)
1. Go to Vercel Dashboard > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Post-Deployment Configuration

#### Test Payments
1. Use Stripe test cards to verify payment flow
2. Check webhook delivery in Stripe Dashboard

#### Test Authentication
1. Verify OAuth providers work correctly
2. Test magic link authentication

#### Test AI Features
1. Verify Claude API integration
2. Test question answering
3. Test AI tutor chat

#### Monitor Logs
1. Check Vercel function logs
2. Monitor Supabase logs
3. Review Stripe webhook logs

## Production Considerations

### Security
- Enable RLS on all Supabase tables
- Use environment variables for all secrets
- Implement rate limiting
- Add CSRF protection

### Performance
- Enable Vercel Edge Functions for global performance
- Configure database connection pooling
- Implement caching strategies
- Optimize image delivery

### Monitoring
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Monitor API usage and costs
- Track user analytics

### Scaling
- Monitor database performance
- Consider read replicas for high traffic
- Implement background job processing
- Plan for Claude API rate limits

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check Supabase status
curl https://your-project.supabase.co/rest/v1/
```

#### Authentication Problems
- Verify redirect URLs in Supabase
- Check OAuth app configurations
- Ensure NEXT_PUBLIC_SUPABASE_URL is correct

#### Payment Integration Issues
- Verify Stripe webhook signatures
- Check webhook endpoint is reachable
- Ensure correct Stripe keys for environment

#### Claude API Issues
- Check API key validity
- Monitor rate limits and usage
- Verify request/response format

### Getting Help

1. Check logs in Vercel Dashboard
2. Review Supabase logs and metrics
3. Contact support channels:
   - GitHub Issues
   - Email: support@ai-torium.com

## Maintenance

### Regular Tasks
- Monitor usage and costs
- Update dependencies
- Review security logs
- Backup database regularly

### Updates
- Test in staging environment first
- Use Vercel preview deployments
- Monitor error rates after deployment
- Have rollback plan ready

## Cost Optimization

### API Usage
- Monitor Claude API usage
- Implement caching for repeated queries
- Set up usage alerts

### Infrastructure
- Review Vercel usage and pricing
- Optimize Supabase usage
- Monitor Stripe processing fees

### Scaling Strategy
- Plan for traffic growth
- Consider enterprise pricing tiers
- Implement usage-based billing