create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('viewer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  translations jsonb not null default '{}'::jsonb,
  cover_image_url text,
  cover_image_alt text,
  category text not null default '',
  tags text[] not null default '{}'::text[],
  read_time text not null default '',
  author_name text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.articles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "articles_public_select_published" on public.articles;
create policy "articles_public_select_published"
on public.articles
for select
using (status = 'published');

drop policy if exists "articles_admin_select_all" on public.articles;
create policy "articles_admin_select_all"
on public.articles
for select
to authenticated
using (public.is_admin());

drop policy if exists "articles_admin_insert" on public.articles;
create policy "articles_admin_insert"
on public.articles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "articles_admin_update" on public.articles;
create policy "articles_admin_update"
on public.articles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "articles_admin_delete" on public.articles;
create policy "articles_admin_delete"
on public.articles
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('article-covers', 'article-covers', true),
  ('article-inline-assets', 'article-inline-assets', true)
on conflict (id) do nothing;

drop policy if exists "public_read_article_covers" on storage.objects;
create policy "public_read_article_covers"
on storage.objects
for select
using (bucket_id = 'article-covers');

drop policy if exists "admin_manage_article_covers" on storage.objects;
create policy "admin_manage_article_covers"
on storage.objects
for all
to authenticated
using (bucket_id = 'article-covers' and public.is_admin())
with check (bucket_id = 'article-covers' and public.is_admin());

drop policy if exists "public_read_article_inline_assets" on storage.objects;
create policy "public_read_article_inline_assets"
on storage.objects
for select
using (bucket_id = 'article-inline-assets');

drop policy if exists "admin_manage_article_inline_assets" on storage.objects;
create policy "admin_manage_article_inline_assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'article-inline-assets' and public.is_admin())
with check (bucket_id = 'article-inline-assets' and public.is_admin());

comment on table public.articles is
'Portfolio articles for My Notes. Promote a user to admin manually with: update public.profiles set role = ''admin'' where email = ''your@email.com'';';
