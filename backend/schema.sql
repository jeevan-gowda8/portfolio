-- ═════════════════════════════════════════════════════════════════════
-- SUPABASE DATABASE SCHEMA FOR JEEVAN GOWDA PORTFOLIO
-- Execute this script inside your Supabase Project -> SQL Editor
-- ═════════════════════════════════════════════════════════════════════

-- 1. Create Portfolio Table (Stores live portfolio JSON configuration)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast JSON queries
CREATE INDEX IF NOT EXISTS idx_portfolio_id ON public.portfolio(id);

-- 2. Create Contacts Table (Stores inbound messages from the portfolio contact form)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering by creation timestamp and filtering by status
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- 3. Row-Level Security (RLS) Setup
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio data
CREATE POLICY "Public Read Portfolio"
ON public.portfolio
FOR SELECT
USING (true);

-- Allow public insert into contacts (so visitors can send messages)
CREATE POLICY "Public Insert Contacts"
ON public.contacts
FOR INSERT
WITH CHECK (
  length(trim(name)) > 0 AND
  length(trim(email)) > 0 AND
  length(trim(message)) > 0 AND
  length(message) <= 2000
);

-- Allow full access to backend service role
CREATE POLICY "Service Role Full Access Portfolio"
ON public.portfolio
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service Role Full Access Contacts"
ON public.contacts
FOR ALL
USING (auth.role() = 'service_role');

-- 4. Admin Users Table (For Supabase database-driven admin authentication)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access Admin Users"
ON public.admin_users
FOR ALL
USING (auth.role() = 'service_role');

-- Seed Initial Admin User (replace CHANGE_ME with your own password before running)
INSERT INTO public.admin_users (email, password_hash, role)
VALUES ('jeevangowdajeevan080@gmail.com', 'CHANGE_ME', 'admin')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

