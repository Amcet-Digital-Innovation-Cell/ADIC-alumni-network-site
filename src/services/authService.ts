import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types/database';

export const authService = {
  // Step 1: Sign Up with Supabase Auth
  async signUp(email: string, password: string) {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
      };
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Step 2: Register user profile with pending registration status
  async registerAlumniUser(
    userId: string,
    email: string,
    name: string,
    registerNumber?: string,
    departmentId?: string,
    batch?: string,
    graduationYear?: number
  ) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('register_alumni_user', {
        p_user_id: userId,
        p_email: email.trim().toLowerCase(),
        p_name: name.trim(),
        p_register_number: registerNumber ? registerNumber.trim().toUpperCase() : null,
        p_department_id: departmentId || null,
        p_batch: batch || null,
        p_graduation_year: graduationYear || null,
      });

      if (error) throw error;
      return data;
    }

    // Mock local pending registration
    const mockProfile: UserProfile = {
      id: userId,
      email,
      role: 'alumni',
      register_number: registerNumber,
      registration_status: 'pending',
      is_verified: false,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('amcet_user_profile', JSON.stringify(mockProfile));
    return { success: true, status: 'pending' };
  },

  // Admin approval / rejection of registration
  async processRegistration(
    userId: string,
    status: 'approved' | 'rejected' | 'blocked',
    rejectionReason?: string,
    reviewerId?: string,
    isDistinguished: boolean = false
  ) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('process_alumni_registration', {
        p_user_id: userId,
        p_status: status,
        p_rejection_reason: rejectionReason || null,
        p_reviewer_id: reviewerId || null,
        p_is_distinguished: isDistinguished,
      });

      if (error) throw error;
      return data;
    }

    return { success: true, status };
  },

  // Login
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      let role: 'alumni' | 'admin' = 'alumni';
      if (email.toLowerCase().includes('admin')) {
        role = 'admin';
      }
      const mockUser = {
        id: role === 'admin' ? 'admin-123' : 'user-arun',
        email,
        role,
      };
      localStorage.setItem('amcet_mock_user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Logout
  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('amcet_mock_user');
    localStorage.removeItem('amcet_user_profile');
  },

  // Get current user profile from user_profiles table
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('amcet_mock_user');
      if (stored) {
        const u = JSON.parse(stored);
        return {
          id: u.id,
          email: u.email,
          role: u.role || 'alumni',
          registration_status: u.role === 'admin' ? 'approved' : 'approved',
          is_verified: true,
        };
      }
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  },

  // Get all pending registrations for admin review with full alumni details
  async getPendingRegistrations(): Promise<any[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, alumni:alumni_profiles(*, department:departments(*))')
        .eq('registration_status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    }
    return [
      {
        id: 'user-pending-1',
        email: 'pending.graduate@amcet.edu',
        role: 'alumni',
        register_number: 'AMC21CSE099',
        registration_status: 'pending',
        is_verified: false,
        created_at: new Date().toISOString(),
        alumni: {
          name: 'Suresh Kumar',
          register_number: 'AMC21CSE099',
          batch: '2021-2025',
          graduation_year: 2025,
          department: { name: 'Computer Science & Engineering', code: 'CSE' }
        }
      },
    ];
  },
};
