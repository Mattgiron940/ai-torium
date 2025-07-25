-- Row Level Security (RLS) policies
alter table public.users enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.study_sessions enable row level security;
alter table public.achievements enable row level security;
alter table public.learning_paths enable row level security;

-- Basic RLS policies (users can access their own data)
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own questions" on public.questions for select using (auth.uid() = user_id);
create policy "Users can insert own questions" on public.questions for insert with check (auth.uid() = user_id);
create policy "Users can view all questions" on public.questions for select using (true);

create policy "Users can view answers to questions" on public.answers for select using (true);
create policy "Users can insert answers" on public.answers for insert with check (true);

-- Chat sessions policies
create policy "Users can view own chat sessions" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own chat sessions" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own chat sessions" on public.chat_sessions for update using (auth.uid() = user_id);

create policy "Users can view own chat messages" on public.chat_messages 
for select using (
  exists (
    select 1 from public.chat_sessions 
    where chat_sessions.id = chat_messages.chat_session_id 
    and chat_sessions.user_id = auth.uid()
  )
);

create policy "Users can insert own chat messages" on public.chat_messages 
for insert with check (
  exists (
    select 1 from public.chat_sessions 
    where chat_sessions.id = chat_messages.chat_session_id 
    and chat_sessions.user_id = auth.uid()
  )
);

-- Study sessions policies
create policy "Users can view own study sessions" on public.study_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own study sessions" on public.study_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own study sessions" on public.study_sessions for update using (auth.uid() = user_id);

-- Achievements policies
create policy "Users can view own achievements" on public.achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.achievements for insert with check (auth.uid() = user_id);

-- Learning paths policies
create policy "Users can view own learning paths" on public.learning_paths for select using (auth.uid() = user_id);
create policy "Users can insert own learning paths" on public.learning_paths for insert with check (auth.uid() = user_id);
create policy "Users can update own learning paths" on public.learning_paths for update using (auth.uid() = user_id);

-- Public read access for subjects
alter table public.subjects enable row level security;
create policy "Anyone can view subjects" on public.subjects for select using (true);

-- Subscriptions policies (users can only see their own)
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can update own subscription" on public.subscriptions for update using (auth.uid() = user_id);

-- Analytics events (users can only insert their own)
alter table public.analytics_events enable row level security;
create policy "Users can insert own analytics events" on public.analytics_events for insert with check (auth.uid() = user_id);

-- Leads table (admin access only - no RLS for now, handle in application layer)
-- alter table public.leads enable row level security;