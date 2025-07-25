-- Insert default subjects
insert into public.subjects (name, slug, description, color_hex) values
    ('Mathematics', 'mathematics', 'Algebra, Calculus, Geometry, Statistics', '#3B82F6'),
    ('Physics', 'physics', 'Mechanics, Thermodynamics, Electromagnetism', '#8B5CF6'),
    ('Chemistry', 'chemistry', 'Organic, Inorganic, Physical Chemistry', '#10B981'),
    ('Biology', 'biology', 'Cell Biology, Genetics, Ecology', '#F59E0B'),
    ('Computer Science', 'computer-science', 'Programming, Algorithms, Data Structures', '#EF4444'),
    ('English', 'english', 'Literature, Grammar, Writing', '#84CC16'),
    ('History', 'history', 'World History, US History, Ancient Civilizations', '#F97316'),
    ('Economics', 'economics', 'Microeconomics, Macroeconomics, Finance', '#06B6D4'),
    ('Psychology', 'psychology', 'Cognitive, Social, Developmental Psychology', '#EC4899'),
    ('Philosophy', 'philosophy', 'Ethics, Logic, Metaphysics', '#6366F1');

-- Functions for gamification
create or replace function public.award_points(user_uuid uuid, points integer, reason text)
returns void as $$
begin
    update public.users 
    set total_points = total_points + points
    where id = user_uuid;
    
    -- Log the points award
    insert into public.analytics_events (user_id, event_name, event_properties)
    values (user_uuid, 'points_awarded', jsonb_build_object('points', points, 'reason', reason));
end;
$$ language plpgsql;

-- Function to check and reset daily question limit
create or replace function public.check_daily_limit(user_uuid uuid)
returns boolean as $$
declare
    user_record record;
    reset_needed boolean := false;
begin
    select * into user_record from public.users where id = user_uuid;
    
    -- Check if we need to reset (new day)
    if user_record.last_question_reset::date < current_date then
        update public.users 
        set questions_used_today = 0,
            last_question_reset = now()
        where id = user_uuid;
        reset_needed := true;
    end if;
    
    -- Return true if user can ask more questions
    return (user_record.questions_used_today < user_record.questions_limit) or reset_needed;
end;
$$ language plpgsql;

-- Trigger to update user stats when questions are created
create or replace function update_user_question_stats()
returns trigger as $$
begin
    update public.users 
    set total_questions_asked = total_questions_asked + 1,
        questions_used_today = questions_used_today + 1
    where id = new.user_id;
    
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_question_stats
    after insert on public.questions
    for each row execute function update_user_question_stats();

-- Updated timestamp triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on public.users
    for each row execute function update_updated_at_column();
create trigger update_questions_updated_at before update on public.questions
    for each row execute function update_updated_at_column();
create trigger update_answers_updated_at before update on public.answers
    for each row execute function update_updated_at_column();

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Function to calculate user level based on points
create or replace function public.calculate_user_level(points integer)
returns integer as $$
begin
    -- Level formula: level = floor(sqrt(points/100)) + 1
    return floor(sqrt(points::float / 100)) + 1;
end;
$$ language plpgsql;

-- Function to update user level when points change
create or replace function update_user_level()
returns trigger as $$
begin
    if old.total_points != new.total_points then
        new.level_id = public.calculate_user_level(new.total_points);
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_user_level
    before update on public.users
    for each row execute function update_user_level();

-- Function to get user analytics summary
create or replace function public.get_user_analytics(user_uuid uuid)
returns jsonb as $$
declare
    result jsonb;
begin
    select jsonb_build_object(
        'total_questions', total_questions_asked,
        'total_points', total_points,
        'current_level', level_id,
        'current_streak', current_streak,
        'favorite_subjects', favorite_subjects,
        'study_time_hours', round(total_study_time_minutes::numeric / 60, 1),
        'questions_this_week', (
            select count(*) 
            from public.questions 
            where user_id = user_uuid 
            and created_at >= date_trunc('week', now())
        ),
        'avg_confidence', (
            select round(avg(confidence_score)::numeric, 2)
            from public.answers a
            join public.questions q on a.question_id = q.id
            where q.user_id = user_uuid
        )
    ) into result
    from public.users
    where id = user_uuid;
    
    return result;
end;
$$ language plpgsql;