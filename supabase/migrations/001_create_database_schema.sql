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

-- Questions with advanced features
create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    subject_id uuid references public.subjects(id) not null,
    
    -- Content
    title text not null,
    content text not null,
    question_type text default 'text' check (question_type in ('text', 'image', 'mixed', 'voice')),
    difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
    
    -- Media attachments
    image_urls text[],
    audio_url text,
    ocr_extracted_text text,
    latex_content text,
    
    -- AI Analysis
    claude_complexity_score float,
    estimated_solve_time_minutes integer,
    required_knowledge_areas text[],
    ai_generated_tags text[],
    
    -- Status and workflow
    status text default 'pending' check (status in ('pending', 'answered', 'verified', 'featured')),
    is_urgent boolean default false,
    is_homework boolean default false,
    is_test_prep boolean default false,
    
    -- Engagement
    view_count integer default 0,
    upvotes integer default 0,
    downvotes integer default 0,
    bookmark_count integer default 0,
    
    -- Timestamps
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    answered_at timestamp with time zone,
    deadline timestamp with time zone
);

-- AI-generated answers with advanced features
create table public.answers (
    id uuid default uuid_generate_v4() primary key,
    question_id uuid references public.questions(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete set null,
    
    -- Content
    content text not null,
    answer_type text default 'ai' check (answer_type in ('ai', 'human', 'hybrid')),
    confidence_score float check (confidence_score >= 0 and confidence_score <= 1),
    
    -- AI metadata
    claude_model_used text,
    processing_time_ms integer,
    tokens_used integer,
    reasoning_steps jsonb,
    sources_cited text[],
    
    -- Formatting
    has_latex boolean default false,
    has_code boolean default false,
    has_diagrams boolean default false,
    formatted_content jsonb,
    
    -- Quality metrics
    accuracy_rating float,
    helpfulness_score float,
    clarity_score float,
    completeness_score float,
    
    -- User feedback
    upvotes integer default 0,
    downvotes integer default 0,
    reports integer default 0,
    
    -- Status
    is_featured boolean default false,
    is_verified boolean default false,
    moderation_status text default 'approved' check (moderation_status in ('pending', 'approved', 'rejected')),
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Study sessions and learning analytics
create table public.study_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    subject_id uuid references public.subjects(id),
    
    session_type text check (session_type in ('q_and_a', 'tutor_chat', 'practice', 'review')),
    duration_minutes integer,
    questions_asked integer default 0,
    concepts_learned text[],
    difficulty_progression jsonb,
    
    -- Performance metrics
    accuracy_rate float,
    improvement_score float,
    focus_score float,
    engagement_score float,
    
    started_at timestamp with time zone default now(),
    ended_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Subscriptions with advanced billing
create table public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    
    -- Stripe integration
    stripe_customer_id text unique,
    stripe_subscription_id text unique,
    stripe_payment_intent_id text,
    
    -- Subscription details
    tier text not null check (tier in ('free', 'premium', 'pro', 'enterprise')),
    status text default 'active' check (status in ('active', 'canceled', 'past_due', 'paused')),
    billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
    
    -- Pricing
    amount_cents integer not null,
    currency text default 'usd',
    
    -- Usage limits
    monthly_question_limit integer,
    ai_tutor_minutes_limit integer,
    advanced_features_enabled boolean default false,
    priority_support boolean default false,
    
    -- Dates
    trial_ends_at timestamp with time zone,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    canceled_at timestamp with time zone,
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Lead generation and outreach
create table public.leads (
    id uuid default uuid_generate_v4() primary key,
    
    -- Contact information
    email text,
    phone text,
    full_name text,
    
    -- Source tracking
    source text check (source in ('reddit_scrape', 'forum_scrape', 'google_ads', 'organic', 'referral')),
    source_url text,
    scraped_content text,
    interest_keywords text[],
    
    -- Outreach tracking
    outreach_status text default 'new' check (outreach_status in ('new', 'contacted', 'responded', 'converted', 'unqualified')),
    contact_attempts integer default 0,
    last_contacted_at timestamp with time zone,
    
    -- Conversion tracking
    signed_up boolean default false,
    subscription_tier text,
    lifetime_value_cents integer default 0,
    
    -- AI analysis
    lead_score float check (lead_score >= 0 and lead_score <= 100),
    predicted_conversion_probability float,
    recommended_outreach_message text,
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Real-time chat sessions for AI tutoring
create table public.chat_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    subject_id uuid references public.subjects(id),
    
    session_name text,
    session_type text default 'tutor' check (session_type in ('tutor', 'homework_help', 'test_prep', 'concept_review')),
    status text default 'active' check (status in ('active', 'paused', 'completed')),
    
    -- AI configuration
    ai_personality text default 'friendly_tutor',
    difficulty_level text,
    learning_objectives text[],
    
    -- Session metrics
    message_count integer default 0,
    duration_minutes integer default 0,
    concepts_covered text[],
    knowledge_gaps_identified text[],
    
    started_at timestamp with time zone default now(),
    ended_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Chat messages
create table public.chat_messages (
    id uuid default uuid_generate_v4() primary key,
    chat_session_id uuid references public.chat_sessions(id) on delete cascade not null,
    
    role text check (role in ('user', 'assistant', 'system')),
    content text not null,
    message_type text default 'text' check (message_type in ('text', 'image', 'code', 'latex', 'file')),
    
    -- AI metadata
    tokens_used integer,
    processing_time_ms integer,
    confidence_score float,
    
    -- Attachments
    attachments jsonb,
    
    created_at timestamp with time zone default now()
);

-- User achievements and badges
create table public.achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    
    badge_type text not null,
    badge_name text not null,
    badge_description text,
    badge_icon_url text,
    
    -- Requirements met
    requirement_type text,
    requirement_value integer,
    
    earned_at timestamp with time zone default now(),
    is_featured boolean default false
);

-- Learning path and curriculum
create table public.learning_paths (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    subject_id uuid references public.subjects(id) not null,
    
    path_name text not null,
    description text,
    difficulty_level text,
    estimated_hours integer,
    
    -- Progress tracking
    current_step integer default 1,
    total_steps integer not null,
    completion_percentage float default 0,
    
    -- Content
    curriculum jsonb not null,
    milestones jsonb,
    
    status text default 'active' check (status in ('active', 'paused', 'completed')),
    
    started_at timestamp with time zone default now(),
    completed_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Analytics events for detailed tracking
create table public.analytics_events (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete set null,
    session_id text,
    
    event_name text not null,
    event_category text,
    event_properties jsonb,
    
    -- Device/browser info
    user_agent text,
    ip_address inet,
    country text,
    city text,
    
    created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_users_subscription_tier on public.users(subscription_tier);
create index idx_users_total_points on public.users(total_points desc);
create index idx_questions_user_id on public.questions(user_id);
create index idx_questions_subject_id on public.questions(subject_id);
create index idx_questions_status on public.questions(status);
create index idx_questions_created_at on public.questions(created_at desc);
create index idx_answers_question_id on public.answers(question_id);
create index idx_answers_confidence_score on public.answers(confidence_score desc);
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_chat_messages_session_id on public.chat_messages(chat_session_id);
create index idx_leads_outreach_status on public.leads(outreach_status);
create index idx_leads_lead_score on public.leads(lead_score desc);
create index idx_analytics_events_user_id on public.analytics_events(user_id);
create index idx_analytics_events_created_at on public.analytics_events(created_at desc);