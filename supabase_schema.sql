-- ==============================================================================
-- OPENCODE / NULLSEC SUPABASE DATABASE SCHEMA
-- Copy and run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "desc" text not null,
  tags text[] default array[]::text[],
  stars integer default 0,
  lang text not null default 'Rust',
  "langColor" text default '#dea584',
  url text not null,
  live_url text,
  author text default 'NullSec Member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Allow public read access to projects
create policy "Allow public read access to projects"
  on public.projects for select
  using (true);

-- Allow public insertion of projects
create policy "Allow public insert to projects"
  on public.projects for insert
  with check (true);


-- 2. Create Membership / Joining Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  handle text,
  github_url text,
  role_interest text not null,
  experience_level text not null,
  skills text[] default array[]::text[],
  statement text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for applications
alter table public.applications enable row level security;

-- Allow anonymous users to submit applications
create policy "Allow public insert to applications"
  on public.applications for insert
  with check (true);

-- Applications read access is restricted to authenticated / admin users
create policy "Allow authenticated read to applications"
  on public.applications for select
  to authenticated
  using (true);


-- 3. Seed Initial Projects (Optional)
insert into public.projects (name, "desc", tags, stars, lang, "langColor", url)
values
  ('VulnScan', 'Automated vulnerability scanner with CVE correlation and severity scoring. OWASP Top-10 coverage.', array['Scanner', 'Automation'], 445, 'Python', '#3572A5', 'https://github.com/nullsec-collective/vulnscan'),
  ('BruteForge', 'High-performance password audit framework supporting 40+ hash types with GPU acceleration.', array['Password', 'Cryptography'], 312, 'Rust', '#dea584', 'https://github.com/nullsec-collective/bruteforge'),
  ('MemVault', 'Memory forensics toolkit for live incident response. Dump, analyze, and correlate process artifacts.', array['Forensics', 'IR'], 234, 'C++', '#f34b7d', 'https://github.com/nullsec-collective/memvault'),
  ('NullTrace', 'Multi-hop network packet anonymizer. Routes traffic through randomized relay chains with E2E encryption.', array['Network', 'Privacy'], 189, 'Go', '#00ADD8', 'https://github.com/nullsec-collective/nulltrace'),
  ('CryptoMesh', 'Peer-to-peer encrypted messaging protocol with perfect forward secrecy and deniable authentication.', array['Cryptography', 'P2P'], 156, 'Rust', '#dea584', 'https://github.com/nullsec-collective/cryptomesh'),
  ('PhishKit', 'Authorized phishing simulation platform for security awareness training. Full campaign analytics.', array['Social Engineering', 'Automation'], 98, 'TypeScript', '#3178c6', 'https://github.com/nullsec-collective/phishkit')
on conflict do nothing;
