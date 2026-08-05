-- =======================================================
-- PROJECT HUB - SUPABASE DATABASE SCHEMA MIGRATION
-- Target: PostgreSQL / Supabase
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------
-- 1. PROFILES TABLE (User Profile Metadata)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  faculty_id TEXT,
  department_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 2. FACULTIES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 3. DEPARTMENTS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  faculty_id TEXT NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hod_name TEXT,
  hod_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 4. CATEGORIES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 5. REPOSITORY RECORDS TABLE (Projects & Theses)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.repository_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  record_type TEXT NOT NULL CHECK (record_type IN ('PROJECT', 'THESIS')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_HOD', 'PENDING_DEAN', 'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED')),
  abstract TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_id TEXT,
  supervisor_name TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  faculty_id TEXT NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- -------------------------------------------------------
-- 6. USER BOOKMARKS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  record_id UUID NOT NULL REFERENCES public.repository_records(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_record_bookmark UNIQUE (user_id, record_id)
);

-- -------------------------------------------------------
-- 7. AUDIT LOGS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- AUTOMATIC TIMESTAMP TRIGGER
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_records_updated_at ON public.repository_records;
CREATE TRIGGER set_records_updated_at
  BEFORE UPDATE ON public.repository_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repository_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access
CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read published records" ON public.repository_records FOR SELECT USING (status = 'PUBLISHED');

-- 2. Full Access Policies for Admin Management
DROP POLICY IF EXISTS "Admin full access faculties" ON public.faculties;
CREATE POLICY "Admin full access faculties" ON public.faculties FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access departments" ON public.departments;
CREATE POLICY "Admin full access departments" ON public.departments FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access records" ON public.repository_records;
CREATE POLICY "Admin full access records" ON public.repository_records FOR ALL USING (true);

-- 3. User Bookmarks Access
CREATE POLICY "Users read own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 4. Profiles Access
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
