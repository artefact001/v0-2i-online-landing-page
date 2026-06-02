-- ============ CORE TABLES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text default '',
  last_name text default '',
  role text not null default 'student' check (role in ('admin','professor','student')),
  phone text,
  avatar_url text,
  formation text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.formations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price numeric not null default 0,
  image_url text,
  category text,
  level text,
  duration_weeks integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.professor_formations (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references public.profiles(id) on delete cascade,
  formation_id uuid not null references public.formations(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (professor_id, formation_id)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references public.formations(id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  content text,
  content_type text default 'video_text',
  duration_minutes integer not null default 0,
  order_index integer not null default 0,
  is_published boolean not null default false,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  description text,
  exercise_type text not null default 'qcm',
  content jsonb not null default '{}'::jsonb,
  points integer not null default 0,
  time_limit_minutes integer,
  order_index integer not null default 0,
  is_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_submissions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer,
  max_score integer,
  is_passed boolean,
  feedback text,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  unique (exercise_id, student_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  formation_id uuid not null references public.formations(id) on delete cascade,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  progress_percentage integer not null default 0,
  created_at timestamptz not null default now(),
  unique (student_id, formation_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  formation_id uuid references public.formations(id) on delete set null,
  amount numeric not null default 0,
  payment_method text,
  currency text not null default 'XOF',
  status text not null default 'pending',
  reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  is_completed boolean not null default false,
  watch_time_seconds integer not null default 0,
  last_position_seconds integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

-- ============ LIVE SESSIONS ============
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references public.formations(id) on delete set null,
  professor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  scheduled_at timestamptz,
  duration_minutes integer not null default 60,
  meeting_url text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

-- ============ CERTIFICATES ============
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  formation_id uuid not null references public.formations(id) on delete cascade,
  certificate_number text unique not null,
  issued_at timestamptz not null default now(),
  unique (student_id, formation_id)
);

-- ============ FORUM & MESSAGES ============
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references public.formations(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  content text,
  is_pinned boolean not null default false,
  views_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  content text not null,
  is_solution boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ NOTES & FAVORITES ============
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  content text not null,
  timestamp_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  formation_id uuid references public.formations(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============ GAMIFICATION ============
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  points_required integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (student_id, badge_id)
);

create table if not exists public.user_points (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade unique,
  total_points integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

-- ============ PROMO & AFFILIATION ============
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percentage integer not null default 0,
  discount_amount numeric,
  max_uses integer,
  uses_count integer not null default 0,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  affiliate_code text unique not null,
  total_referrals integer not null default 0,
  total_earnings numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  referred_user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending',
  commission numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ============ INDEXES ============
create index if not exists idx_modules_formation on public.modules(formation_id);
create index if not exists idx_lessons_module on public.lessons(module_id);
create index if not exists idx_exercises_lesson on public.exercises(lesson_id);
create index if not exists idx_submissions_student on public.exercise_submissions(student_id);
create index if not exists idx_enrollments_student on public.enrollments(student_id);
create index if not exists idx_lesson_progress_student on public.lesson_progress(student_id);
create index if not exists idx_payments_student on public.payments(student_id);
create index if not exists idx_forum_replies_topic on public.forum_replies(topic_id);
