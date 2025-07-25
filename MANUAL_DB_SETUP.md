# AI-TORIUM Manual Database Setup Guide

Since we're having CLI authentication issues, please follow these steps to set up your database manually through the Supabase web interface.

## 🗄️ Step-by-Step Database Setup

### Step 1: Access Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your project: `kzwezhtenxwdrmnuvevs`
4. Click on "SQL Editor" in the left sidebar

### Step 2: Apply Database Schema

Copy and paste the following SQL into the SQL Editor and click "Run":

```sql
-- AI-TORIUM Enhanced Database Schema
-- Advanced AI learning platform with gamification, analytics, and monetization

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table with advanced profile features
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    username text unique,
    grade_level text,
    subjects_of_interest text[],
    learning_style text check (learning_style in ('visual', 'auditory', 'kinesthetic', 'reading')),
    timezone text default 'UTC',
    preferred_language text default 'en',
    
    -- Gamification
    total_points integer default 0,
    current_streak integer default 0,
    longest_streak integer default 0,
    level_id integer default 1,
    badges text[] default '{}',
    
    -- Subscription & Usage
    subscription_tier text default 'free' check (subscription_tier in ('free', 'premium', 'pro', 'enterprise')),
    questions_used_today integer default 0,
    questions_limit integer default 5,
    last_question_reset timestamp with time zone default now(),
    
    -- Analytics
    total_questions_asked integer default 0,
    total_answers_given integer default 0,
    favorite_subjects text[],
    study_session_count integer default 0,
    total_study_time_minutes integer default 0,
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Subjects and categories
create table public.subjects (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    description text,
    icon_url text,
    color_hex text,
    difficulty_levels text[] default '{"beginner", "intermediate", "advanced"}',
    parent_subject_id uuid references public.subjects(id),
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- Continue with remaining tables...
```

### Step 3: Apply Complete Schema

The complete schema is quite large. For simplicity, I've created a combined SQL file for you. Please:

1. Open the file `complete_migration.sql` in your project
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click "Run"

### Step 4: Verify Setup

After running the SQL, verify these tables exist in your database:
- ✅ users
- ✅ subjects  
- ✅ questions
- ✅ answers
- ✅ chat_sessions
- ✅ chat_messages
- ✅ subscriptions
- ✅ leads
- ✅ study_sessions
- ✅ achievements
- ✅ learning_paths
- ✅ analytics_events

### Step 5: Test Your Platform

1. Visit your live URL: https://ai-torium-jlhr2o6ic-matthew-girons-projects-65a64fc8.vercel.app
2. Try to sign up/login
3. Test asking a question

## 🔧 Alternative: Using CLI (If You Get Access Token)

If you have a Supabase access token, you can use the CLI:

```bash
export SUPABASE_ACCESS_TOKEN="your_access_token_here"
supabase link --project-ref kzwezhtenxwdrmnuvevs
supabase db push
```

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify all environment variables are set correctly
3. Make sure RLS policies are applied

Your AI-TORIUM platform will be fully functional once the database is set up!