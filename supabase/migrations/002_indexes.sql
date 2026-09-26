-- Migration 002: Indexes for AMCET Alumni Network

CREATE INDEX IF NOT EXISTS idx_user_profiles_reg_status ON public.user_profiles(registration_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_reg_no ON public.user_profiles(register_number);

CREATE INDEX IF NOT EXISTS idx_alumni_master_reg_no ON public.alumni_master(register_number);
CREATE INDEX IF NOT EXISTS idx_alumni_master_email ON public.alumni_master(registered_email);

CREATE INDEX IF NOT EXISTS idx_alumni_profiles_user_id ON public.alumni_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_reg_no ON public.alumni_profiles(register_number);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_dept ON public.alumni_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_company ON public.alumni_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_batch ON public.alumni_profiles(batch);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_grad_year ON public.alumni_profiles(graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_public ON public.alumni_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_distinguished ON public.alumni_profiles(is_distinguished);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_name ON public.alumni_profiles(name);

CREATE INDEX IF NOT EXISTS idx_career_exp_alumni ON public.career_experiences(alumni_id);
CREATE INDEX IF NOT EXISTS idx_achievements_alumni ON public.achievements(alumni_id);

CREATE INDEX IF NOT EXISTS idx_profile_req_alumni ON public.profile_update_requests(alumni_id);
CREATE INDEX IF NOT EXISTS idx_profile_req_status ON public.profile_update_requests(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
