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
DROP POLICY IF EXISTS "Public read faculties" ON public.faculties;
CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read departments" ON public.departments;
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published records" ON public.repository_records;
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

DROP POLICY IF EXISTS "Authenticated users insert records" ON public.repository_records;
CREATE POLICY "Authenticated users insert records" ON public.repository_records FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users read all records" ON public.repository_records;
CREATE POLICY "Authenticated users read all records" ON public.repository_records FOR SELECT USING (true);

-- 3. User Bookmarks Access
DROP POLICY IF EXISTS "Users read own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users read own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users insert own bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users delete own bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 4. Profiles Access
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- -------------------------------------------------------
-- 5. INITIAL SEED DATA (Faculties, Departments, Categories)
-- -------------------------------------------------------
INSERT INTO public.faculties (id, name, code)
SELECT 'fast', 'Faculty of Applied Sciences & Tech (FAST)', 'FAST'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'fast' OR name = 'Faculty of Applied Sciences & Tech (FAST)');

INSERT INTO public.faculties (id, name, code)
SELECT 'eng', 'Faculty of Engineering (ENG)', 'ENG'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'eng' OR name = 'Faculty of Engineering (ENG)');

INSERT INTO public.faculties (id, name, code)
SELECT 'hbs', 'HTU Business School (HBS)', 'HBS'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'hbs' OR name = 'HTU Business School (HBS)');

INSERT INTO public.faculties (id, name, code)
SELECT 'art', 'Faculty of Art & Design (ART)', 'ART'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'art' OR name = 'Faculty of Art & Design (ART)');

INSERT INTO public.faculties (id, name, code)
SELECT 'bne', 'Faculty of Built & Natural Environment (BNE)', 'BNE'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'bne' OR name = 'Faculty of Built & Natural Environment (BNE)');

INSERT INTO public.faculties (id, name, code)
SELECT 'fass', 'Faculty of Applied Social Sciences (FASS)', 'FASS'
WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE id = 'fass' OR name = 'Faculty of Applied Social Sciences (FASS)');

-- DEPARTMENTS
INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'cs', 'fast', 'Computer Science', 'CS'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'cs' OR name = 'Computer Science');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'htm', 'fast', 'Hospitality & Tourism Management', 'HTM'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'htm' OR name = 'Hospitality & Tourism Management');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'math', 'fast', 'Mathematics & Statistics', 'STATS'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'math' OR name = 'Mathematics & Statistics');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'food', 'fast', 'Food Technology', 'FOOD'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'food' OR name = 'Food Technology');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'it', 'fast', 'Information Technology', 'IT'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'it' OR name = 'Information Technology');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'agric', 'eng', 'Agricultural Engineering', 'AGRIC'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'agric' OR name = 'Agricultural Engineering');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'civil', 'eng', 'Civil Engineering', 'CIVIL'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'civil' OR name = 'Civil Engineering');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'eee', 'eng', 'Electrical & Electronic Engineering', 'EEE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'eee' OR name = 'Electrical & Electronic Engineering');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'mech', 'eng', 'Mechanical Engineering', 'MECH'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'mech' OR name = 'Mechanical Engineering');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'auto', 'eng', 'Automotive Engineering', 'AUTO'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'auto' OR name = 'Automotive Engineering');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'acc', 'hbs', 'Accountancy', 'ACC'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'acc' OR name = 'Accountancy');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'bf', 'hbs', 'Banking & Finance', 'BF'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'bf' OR name = 'Banking & Finance');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'mkt', 'hbs', 'Marketing', 'MKT'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'mkt' OR name = 'Marketing');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'sms', 'hbs', 'Secretaryship & Management Studies', 'SMS'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'sms' OR name = 'Secretaryship & Management Studies');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'psm', 'hbs', 'Procurement & Supply Chain Management', 'PSM'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'psm' OR name = 'Procurement & Supply Chain Management');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'fdt', 'art', 'Fashion Design & Textiles', 'FDT'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'fdt' OR name = 'Fashion Design & Textiles');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'ia', 'art', 'Industrial Art', 'IA'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'ia' OR name = 'Industrial Art');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'gd', 'art', 'Graphic Design & Advertising', 'GD'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'gd' OR name = 'Graphic Design & Advertising');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'bt', 'bne', 'Building Technology', 'BT'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'bt' OR name = 'Building Technology');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'em', 'bne', 'Estate Management', 'EM'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'em' OR name = 'Estate Management');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'sm', 'bne', 'Surveying & Mapping', 'SM'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'sm' OR name = 'Surveying & Mapping');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'msls', 'fass', 'Multilingual Secretarial & Language Studies', 'MSLS'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'msls' OR name = 'Multilingual Secretarial & Language Studies');

INSERT INTO public.departments (id, faculty_id, name, code)
SELECT 'ls', 'fass', 'Liberal Studies & General Studies', 'LS'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE id = 'ls' OR name = 'Liberal Studies & General Studies');

-- CATEGORIES
INSERT INTO public.categories (id, name, slug, description)
SELECT 'software', 'Software Engineering', 'software-engineering', 'Web apps, desktop software, and system development'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'software' OR name = 'Software Engineering');

INSERT INTO public.categories (id, name, slug, description)
SELECT 'ai-ml', 'Artificial Intelligence & ML', 'ai-machine-learning', 'Machine learning models, neural networks, and AI research'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'ai-ml' OR name = 'Artificial Intelligence & ML');

INSERT INTO public.categories (id, name, slug, description)
SELECT 'cybersecurity', 'Cybersecurity & Networks', 'cybersecurity-networks', 'Network security, cryptography, and cloud infrastructure'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'cybersecurity' OR name = 'Cybersecurity & Networks');

INSERT INTO public.categories (id, name, slug, description)
SELECT 'data-science', 'Data Science & Analytics', 'data-science-analytics', 'Big data analytics, data visualization, and statistics'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'data-science' OR name = 'Data Science & Analytics');

INSERT INTO public.categories (id, name, slug, description)
SELECT 'mobile-dev', 'Mobile App Development', 'mobile-development', 'iOS, Android, and cross-platform mobile solutions'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'mobile-dev' OR name = 'Mobile App Development');
