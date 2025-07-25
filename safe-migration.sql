-- Safe AI-TORIUM Database Migration (won't break if already exists)
-- Run this in Supabase SQL Editor

-- Enable extensions (safe to re-run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS public.users (
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

CREATE TABLE IF NOT EXISTS public.subjects (
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

-- Insert default subjects (safe - uses INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO public.subjects (name, slug, description, color_hex) VALUES
    ('Mathematics', 'mathematics', 'Algebra, Calculus, Geometry, Statistics', '#3B82F6'),
    ('Physics', 'physics', 'Mechanics, Thermodynamics, Electromagnetism', '#8B5CF6'),
    ('Chemistry', 'chemistry', 'Organic, Inorganic, Physical Chemistry', '#10B981'),
    ('Biology', 'biology', 'Cell Biology, Genetics, Ecology', '#F59E0B'),
    ('Computer Science', 'computer-science', 'Programming, Algorithms, Data Structures', '#EF4444'),
    ('English', 'english', 'Literature, Grammar, Writing', '#84CC16'),
    ('History', 'history', 'World History, US History, Ancient Civilizations', '#F97316'),
    ('Economics', 'economics', 'Microeconomics, Macroeconomics, Finance', '#06B6D4'),
    ('Psychology', 'psychology', 'Cognitive, Social, Developmental Psychology', '#EC4899'),
    ('Philosophy', 'philosophy', 'Ethics, Logic, Metaphysics', '#6366F1')
ON CONFLICT (name) DO NOTHING;

-- Test query to verify setup
SELECT 'Database setup check:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
SELECT 'Subjects count: ' || count(*)::text as subjects_check FROM public.subjects;