# AI-TORIUM - Advanced AI Learning Platform

AI-TORIUM is a cutting-edge AI-powered learning platform that provides instant step-by-step explanations, personalized tutoring, and gamified learning experiences. Built with Next.js, Supabase, and Claude AI.

![AI-TORIUM Platform](https://img.shields.io/badge/Platform-AI--TORIUM-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Claude AI](https://img.shields.io/badge/Claude-3.5%20Sonnet-orange)

## ✨ Features

- 🧠 **AI-Powered Explanations**: Get instant, step-by-step solutions using Claude AI
- 📸 **OCR Integration**: Upload images of problems for automatic text extraction
- 💬 **AI Tutor Chat**: Interactive 24/7 AI tutoring sessions with streaming responses
- 🎮 **Gamification**: Points, levels, streaks, badges, and achievements
- 📊 **Analytics**: Detailed learning progress tracking and insights
- 💳 **Subscription Tiers**: Free, Premium, and Pro plans with Stripe integration
- 🔒 **Authentication**: Secure auth with magic links and OAuth providers
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎯 **Lead Generation**: Automated outreach system for user acquisition
- 🔍 **Advanced Search**: Smart content discovery and recommendation

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Claude API, Stripe
- **Authentication**: Supabase Auth with OAuth providers
- **Payments**: Stripe with webhooks and billing portal
- **AI**: Anthropic Claude 3.5 Sonnet
- **OCR**: Tesseract.js, Mathpix (optional)
- **Deployment**: Vercel with Edge Functions
- **Analytics**: PostHog, Vercel Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-torium
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ANTHROPIC_API_KEY=your_claude_api_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

3. **Set up Supabase database**
   ```bash
   # Execute SQL migrations in order:
   # 1. supabase/migrations/001_create_database_schema.sql
   # 2. supabase/migrations/002_create_rls_policies.sql
   # 3. supabase/migrations/003_create_functions_and_triggers.sql
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Complete Setup Guide

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Database Schema

The platform uses a comprehensive PostgreSQL schema with:

- **Users**: Profiles, gamification, subscription data
- **Questions & Answers**: AI-generated responses with metadata
- **Chat Sessions**: Real-time tutoring conversations
- **Subjects**: Organized learning categories
- **Analytics**: Detailed usage tracking
- **Leads**: Outreach and conversion tracking

## API Routes

- `POST /api/claude-answer` - Process questions with Claude AI
- `POST /api/stripe/checkout` - Create Stripe checkout sessions
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/outreach/webhook` - SMS response handling

## Key Components

### Dashboard
- Overview of user progress and stats
- Quick question input with OCR support
- Recent activity and achievements

### AI Tutor Chat
- Real-time chat interface with Claude AI
- Streaming responses with confidence scores
- Session tracking and analytics

### Authentication
- Magic link and OAuth providers
- Protected routes with middleware
- User profile management

## Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Configure custom domain** (optional)

### Docker

```bash
docker build -t ai-torium .
docker run -p 3000:3000 ai-torium
```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations from `supabase/migrations/`
3. Configure authentication providers
4. Set up RLS policies

### Stripe Setup

1. Create Stripe products and prices
2. Set up webhook endpoints
3. Configure subscription tiers

### Claude API

1. Get API key from Anthropic
2. Configure rate limits and usage tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@ai-torium.com or join our Discord community.

## Roadmap

- [ ] Voice input/output
- [ ] Advanced OCR with Mathpix
- [ ] Mobile app (React Native)
- [ ] Collaborative study sessions
- [ ] LMS integration
- [ ] Multi-language support