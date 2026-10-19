-- Migration 003: Row Level Security (RLS) Policies (Idempotent)

-- Enable RLS on all tables
ALTER TABLE public.alumni_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. DEPARTMENTS, INDUSTRIES, COMPANIES (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public departments read" ON public.departments;
CREATE POLICY "Public departments read" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin departments write" ON public.departments;
CREATE POLICY "Admin departments write" ON public.departments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Public industries read" ON public.industries;
CREATE POLICY "Public industries read" ON public.industries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin industries write" ON public.industries;
CREATE POLICY "Admin industries write" ON public.industries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Public companies read" ON public.companies;
CREATE POLICY "Public companies read" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin companies write" ON public.companies;
CREATE POLICY "Admin companies write" ON public.companies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. ALUMNI MASTER (NO Public Read - Strictly Private)
DROP POLICY IF EXISTS "Admin alumni_master read" ON public.alumni_master;
CREATE POLICY "Admin alumni_master read" ON public.alumni_master FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin alumni_master write" ON public.alumni_master;
CREATE POLICY "Admin alumni_master write" ON public.alumni_master FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. USER PROFILES
DROP POLICY IF EXISTS "Users read own profile" ON public.user_profiles;
CREATE POLICY "Users read own profile" ON public.user_profiles FOR SELECT USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users insert own profile" ON public.user_profiles;
CREATE POLICY "Users insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (
  id = auth.uid()
);

DROP POLICY IF EXISTS "Admin update user profiles" ON public.user_profiles;
CREATE POLICY "Admin update user profiles" ON public.user_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. ALUMNI PROFILES
DROP POLICY IF EXISTS "Public read approved alumni profiles" ON public.alumni_profiles;
CREATE POLICY "Public read approved alumni profiles" ON public.alumni_profiles FOR SELECT USING (
  (is_public = true AND EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = user_id AND up.registration_status = 'approved'
  ))
  OR user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users update own alumni profile" ON public.alumni_profiles;
CREATE POLICY "Users update own alumni profile" ON public.alumni_profiles FOR UPDATE USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin write alumni profiles" ON public.alumni_profiles;
CREATE POLICY "Admin write alumni profiles" ON public.alumni_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. CAREER EXPERIENCES & ACHIEVEMENTS
DROP POLICY IF EXISTS "Public read career_experiences" ON public.career_experiences;
CREATE POLICY "Public read career_experiences" ON public.career_experiences FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND (ap.is_public = true OR ap.user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Alumni write career_experiences" ON public.career_experiences;
CREATE POLICY "Alumni write career_experiences" ON public.career_experiences FOR ALL USING (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND ap.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Public read achievements" ON public.achievements;
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND (ap.is_public = true OR ap.user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Alumni write achievements" ON public.achievements;
CREATE POLICY "Alumni write achievements" ON public.achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND ap.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. PROFILE UPDATE REQUESTS
DROP POLICY IF EXISTS "Alumni read own update requests" ON public.profile_update_requests;
CREATE POLICY "Alumni read own update requests" ON public.profile_update_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND ap.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Alumni insert update requests" ON public.profile_update_requests;
CREATE POLICY "Alumni insert update requests" ON public.profile_update_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_id AND ap.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admin update profile requests" ON public.profile_update_requests;
CREATE POLICY "Admin update profile requests" ON public.profile_update_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. NOTIFICATIONS
DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (
  user_id = auth.uid()
);

DROP POLICY IF EXISTS "System/Admin insert notifications" ON public.notifications;
CREATE POLICY "System/Admin insert notifications" ON public.notifications FOR INSERT WITH CHECK (
  true
);

-- 8. AUDIT LOGS
DROP POLICY IF EXISTS "Admin read audit_logs" ON public.audit_logs;
CREATE POLICY "Admin read audit_logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
