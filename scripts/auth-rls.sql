-- ============ Profile auto-creation trigger ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role, formation, is_active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'formation',
    true
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(nullif(excluded.first_name, ''), public.profiles.first_name),
    last_name = coalesce(nullif(excluded.last_name, ''), public.profiles.last_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Helper functions ============
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_professor()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('professor','admin'));
$$;

-- ============ Enable RLS ============
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','formations','professor_formations','modules','lessons','exercises',
    'exercise_submissions','enrollments','payments','lesson_progress','live_sessions',
    'certificates','notes','favorites','forum_topics','forum_replies',
    'messages','badges','user_badges','user_points','promo_codes','affiliates','referrals'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- ============ Policies ============
-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert with check (id = auth.uid() or public.is_admin());

-- Public read content
do $$
declare t text;
begin
  foreach t in array array['formations','modules','lessons','exercises','live_sessions','badges','promo_codes','forum_topics','forum_replies']
  loop
    execute format('drop policy if exists %I_select on public.%I;', t, t);
    execute format('create policy %I_select on public.%I for select using (true);', t, t);
  end loop;
end $$;

-- Admin/professor write content
do $$
declare t text;
begin
  foreach t in array array['formations','modules','lessons','exercises','live_sessions','professor_formations','badges','promo_codes']
  loop
    execute format('drop policy if exists %I_write on public.%I;', t, t);
    execute format('create policy %I_write on public.%I for all using (public.is_professor()) with check (public.is_professor());', t, t);
  end loop;
end $$;

-- Student-owned tables (student_id column)
do $$
declare t text;
begin
  foreach t in array array['exercise_submissions','enrollments','payments','lesson_progress','certificates','notes','favorites','user_badges','user_points']
  loop
    execute format('drop policy if exists %I_owner on public.%I;', t, t);
    execute format('create policy %I_owner on public.%I for all using (student_id = auth.uid() or public.is_professor()) with check (student_id = auth.uid() or public.is_professor());', t, t);
  end loop;
end $$;

-- affiliates (user_id)
drop policy if exists affiliates_owner on public.affiliates;
create policy affiliates_owner on public.affiliates for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

-- referrals (via referred user or admin)
drop policy if exists referrals_owner on public.referrals;
create policy referrals_owner on public.referrals for all using (referred_user_id = auth.uid() or public.is_admin()) with check (public.is_admin() or referred_user_id = auth.uid());

-- forum write (author)
drop policy if exists forum_topics_write on public.forum_topics;
create policy forum_topics_write on public.forum_topics for all using (author_id = auth.uid() or public.is_professor()) with check (author_id = auth.uid() or public.is_professor());
drop policy if exists forum_replies_write on public.forum_replies;
create policy forum_replies_write on public.forum_replies for all using (author_id = auth.uid() or public.is_professor()) with check (author_id = auth.uid() or public.is_professor());

-- messages (sender or recipient)
drop policy if exists messages_rw on public.messages;
create policy messages_rw on public.messages for all using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin()) with check (sender_id = auth.uid() or public.is_admin());
