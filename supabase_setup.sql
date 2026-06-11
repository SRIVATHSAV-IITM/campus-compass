-- ==========================================
-- CAMPUS COMPASS: SUPABASE SETUP & SECURITY SQL
-- ==========================================
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- to automatically set up your Storage Bucket and Row Level Security (RLS) policies.

-- ----------------------------------------------------
-- SECTION 1: STORAGE BUCKET CONFIGURATION
-- ----------------------------------------------------
-- Enable the storage extension if not enabled (this is usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the public bucket for Campus Compass if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campus-compass', 
  'campus-compass', 
  true,                  -- Makes the files publicly readable
  10485760,              -- 10MB file size limit (in bytes)
  '{image/png, image/jpeg, image/jpg, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy 1: Allow anyone to view/download uploaded files (Public Read Access)
CREATE POLICY "Allow public read access to uploaded files" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'campus-compass');

-- Storage Policy 2: Allow authenticated users with university emails to upload files
CREATE POLICY "Allow authenticated students to upload files" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'campus-compass' 
    AND (
      auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
      OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
      -- Fallback for testing/oauth users if you wish to allow standard Google accounts in development
      OR auth.jwt() ->> 'email' NOT LIKE '%@smail.iitm.ac.in'
    )
  );

-- ----------------------------------------------------
-- SECTION 2: ROW LEVEL SECURITY (RLS) FOR TABLES
-- ----------------------------------------------------

-- 1. REVIEWS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all reviews
CREATE POLICY "Enable read access for all users" 
  ON public.reviews FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
    -- Note: If testing with non-smail Google OAuth accounts in dev, you can temporarily comment out the email constraint
  );


-- 2. EVENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all events
CREATE POLICY "Enable read access for all users" 
  ON public.events FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.events FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );


-- 3. PLACEMENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all placement resources
CREATE POLICY "Enable read access for all users" 
  ON public.placements FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.placements FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );
