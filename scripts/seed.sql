-- Ensure pgcrypto for password hashing
create extension if not exists pgcrypto;

-- ============ TEST ACCOUNTS ============
-- Helper to create a confirmed auth user with password + metadata
do $$
declare
  v_admin uuid := gen_random_uuid();
  v_prof  uuid := gen_random_uuid();
  v_stud  uuid := gen_random_uuid();
begin
  -- Clean up if re-running
  delete from auth.users where email in ('admin@2ionline.com','professeur@2ionline.com','etudiant@2ionline.com');

  -- ADMIN
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000', v_admin, 'authenticated', 'authenticated',
    'admin@2ionline.com', crypt('Admin2024!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"2I Online","role":"admin"}',
    now(), now()
  );

  -- PROFESSOR
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000', v_prof, 'authenticated', 'authenticated',
    'professeur@2ionline.com', crypt('Prof2024!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}',
    '{"first_name":"Chef","last_name":"Diallo","role":"professor"}',
    now(), now()
  );

  -- STUDENT
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000', v_stud, 'authenticated', 'authenticated',
    'etudiant@2ionline.com', crypt('Eleve2024!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}',
    '{"first_name":"Moussa","last_name":"Ndiaye","role":"student"}',
    now(), now()
  );

  -- Ensure email identities exist (required for password login)
  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
    (gen_random_uuid(), v_admin, json_build_object('sub', v_admin::text, 'email','admin@2ionline.com'), 'email', 'admin@2ionline.com', now(), now(), now()),
    (gen_random_uuid(), v_prof,  json_build_object('sub', v_prof::text,  'email','professeur@2ionline.com'), 'email', 'professeur@2ionline.com', now(), now(), now()),
    (gen_random_uuid(), v_stud,  json_build_object('sub', v_stud::text,  'email','etudiant@2ionline.com'), 'email', 'etudiant@2ionline.com', now(), now(), now());

  -- Make sure profiles got correct roles (trigger should have created them)
  update public.profiles set role='admin',     first_name='Admin',  last_name='2I Online' where id=v_admin;
  update public.profiles set role='professor', first_name='Chef',   last_name='Diallo'    where id=v_prof;
  update public.profiles set role='student',   first_name='Moussa', last_name='Ndiaye'    where id=v_stud;
end $$;
