export interface Department {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Industry {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  name: string;
  industry_id?: string | null;
  logo_url?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string;
  industry?: Industry | null;
}

export interface AlumniMaster {
  register_number: string;
  name: string;
  department_id?: string | null;
  batch?: string | null;
  graduation_year?: number | null;
  registered_email: string;
  is_claimed: boolean;
  claimed_by?: string | null;
  claimed_at?: string | null;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'alumni' | 'admin';
  register_number?: string | null;
  registration_status: 'pending' | 'approved' | 'rejected' | 'blocked';
  rejection_reason?: string | null;
  is_verified: boolean;
  alumni?: any;
  created_at?: string;
  updated_at?: string;
}

export interface AlumniProfile {
  id: string;
  user_id: string;
  register_number?: string | null;
  name: string;
  photo_url?: string | null;
  department_id?: string | null;
  batch?: string | null;
  graduation_year?: number | null;
  company_id?: string | null;
  current_company?: string | null;
  current_designation?: string | null;
  location?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  show_email: boolean;
  show_linkedin: boolean;
  is_public: boolean;
  is_distinguished: boolean;
  created_at?: string;
  updated_at?: string;
  department?: Department | null;
  company?: Company | null;
}

export interface CareerExperience {
  id: string;
  alumni_id: string;
  company_id?: string | null;
  company_name?: string | null;
  designation: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  created_at?: string;
}

export interface Achievement {
  id: string;
  alumni_id: string;
  title: string;
  description?: string | null;
  year?: number | null;
  organization?: string | null;
  created_at?: string;
}

export interface ProfileUpdateRequest {
  id: string;
  alumni_id: string;
  requested_changes: Record<string, any>;
  current_snapshot: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at?: string;
  alumni?: AlumniProfile | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'registration' | 'update_request' | 'update_approved' | 'update_rejected' | 'verification';
  is_read: boolean;
  created_at: string;
}
