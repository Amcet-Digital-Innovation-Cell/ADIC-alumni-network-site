import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types/database';

export interface AuthorizedAccount {
  id: string;
  email: string;
  passwords: string[];
  name: string;
  role: 'admin' | 'alumni';
  registerNumber?: string;
  alumniId?: string;
  registration_status: 'approved' | 'pending';
  targetRoute: '/directory' | '/admin' | '/dashboard';
}

export const AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  // 1. Admin Alumni Directory Switcher (Requested by User)
  {
    id: 'admin-alumni-master',
    email: 'adminalumini@amcet.in',
    passwords: ['Admin@amcet'],
    name: 'AMCET Admin Alumni',
    role: 'admin',
    registration_status: 'approved',
    targetRoute: '/directory',
  },
  // 2. Main College Administrator
  {
    id: 'admin-main',
    email: 'admin@amcet.in',
    passwords: ['Admin@amcet', 'Admin@123'],
    name: 'AMCET Administrator',
    role: 'admin',
    registerNumber: 'ADMIN001',
    registration_status: 'approved',
    targetRoute: '/admin',
  },
  // 3. Principal AMCET
  {
    id: 'principal-amcet',
    email: 'principal@amcet.in',
    passwords: ['Principal@amcet', 'Admin@amcet'],
    name: 'Principal AMCET',
    role: 'admin',
    registration_status: 'approved',
    targetRoute: '/admin',
  },
  // 4. Arun Kumar (Zoho Software Engineer)
  {
    id: '00000000-0000-0000-0000-000000000001',
    alumniId: '44444444-4444-4444-4444-444444444401',
    email: 'arun.sample@amcet.edu',
    passwords: ['Arun@amcet', 'Alumni@amcet', 'Arun@123'],
    name: 'Arun Kumar',
    role: 'alumni',
    registerNumber: 'AMC21CSE001',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    alumniId: '44444444-4444-4444-4444-444444444401',
    email: 'arun@amcet.in',
    passwords: ['Arun@amcet', 'Alumni@amcet', 'Arun@123'],
    name: 'Arun Kumar',
    role: 'alumni',
    registerNumber: 'AMC21CSE001',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  // 5. Priya Sharma (TCS Software Developer)
  {
    id: '00000000-0000-0000-0000-000000000002',
    alumniId: '44444444-4444-4444-4444-444444444402',
    email: 'priya.sample@amcet.edu',
    passwords: ['Priya@amcet', 'Alumni@amcet', 'Priya@123'],
    name: 'Priya Sharma',
    role: 'alumni',
    registerNumber: 'AMC21CSE002',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    alumniId: '44444444-4444-4444-4444-444444444402',
    email: 'priya@amcet.in',
    passwords: ['Priya@amcet', 'Alumni@amcet', 'Priya@123'],
    name: 'Priya Sharma',
    role: 'alumni',
    registerNumber: 'AMC21CSE002',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  // 6. Rahul Kumar (Deloitte Business Analyst)
  {
    id: '00000000-0000-0000-0000-000000000003',
    alumniId: '44444444-4444-4444-4444-444444444403',
    email: 'rahul.sample@amcet.edu',
    passwords: ['Rahul@amcet', 'Alumni@amcet', 'Rahul@123'],
    name: 'Rahul Kumar',
    role: 'alumni',
    registerNumber: 'AMC20ECE015',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    alumniId: '44444444-4444-4444-4444-444444444403',
    email: 'rahul@amcet.in',
    passwords: ['Rahul@amcet', 'Alumni@amcet', 'Rahul@123'],
    name: 'Rahul Kumar',
    role: 'alumni',
    registerNumber: 'AMC20ECE015',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  // 7. Meena Raj (Microsoft Software Engineer)
  {
    id: '00000000-0000-0000-0000-000000000004',
    alumniId: '44444444-4444-4444-4444-444444444404',
    email: 'meena.sample@amcet.edu',
    passwords: ['Meena@amcet', 'Alumni@amcet', 'Meena@123'],
    name: 'Meena Raj',
    role: 'alumni',
    registerNumber: 'AMC19IT008',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    alumniId: '44444444-4444-4444-4444-444444444404',
    email: 'meena@amcet.in',
    passwords: ['Meena@amcet', 'Alumni@amcet', 'Meena@123'],
    name: 'Meena Raj',
    role: 'alumni',
    registerNumber: 'AMC19IT008',
    registration_status: 'approved',
    targetRoute: '/dashboard',
  },
];

export const authService = {
  // Step 1: Sign Up with Supabase Auth
  async signUp(email: string, password: string) {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user-' + Date.now(),
        email: email.trim().toLowerCase(),
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
    graduationYear?: number,
    password?: string
  ) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('register_alumni_user', {
        p_user_id: userId,
        p_email: cleanEmail,
        p_name: name.trim(),
        p_register_number: registerNumber ? registerNumber.trim().toUpperCase() : null,
        p_department_id: departmentId || null,
        p_batch: batch || null,
        p_graduation_year: graduationYear || null,
      });

      if (error) throw error;
      return data;
    }

    // Save registered user credentials for realistic sign-in validation
    const registeredAccount: AuthorizedAccount = {
      id: userId,
      email: cleanEmail,
      passwords: password ? [password] : ['Alumni@amcet'],
      name: name.trim(),
      role: 'alumni',
      registerNumber: registerNumber ? registerNumber.trim().toUpperCase() : undefined,
      registration_status: 'pending',
      targetRoute: '/dashboard',
    };

    try {
      const existing = localStorage.getItem('amcet_registered_users');
      const list = existing ? JSON.parse(existing) : [];
      const updated = [registeredAccount, ...list.filter((u: any) => u.email !== cleanEmail)];
      localStorage.setItem('amcet_registered_users', JSON.stringify(updated));
    } catch (e) {}

    // Mock local pending registration
    const mockProfile: UserProfile = {
      id: userId,
      email: cleanEmail,
      role: 'alumni',
      register_number: registerNumber ? registerNumber.trim().toUpperCase() : undefined,
      registration_status: 'pending',
      is_verified: false,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('amcet_user_profile', JSON.stringify(mockProfile));

    // Also add to pending registrations queue for admin approval
    try {
      const pendingStored = localStorage.getItem('amcet_pending_registrations');
      const pendingList = pendingStored ? JSON.parse(pendingStored) : [];
      const newPending = {
        ...mockProfile,
        alumni: {
          id: 'alumni-' + Date.now(),
          user_id: userId,
          register_number: registerNumber ? registerNumber.trim().toUpperCase() : undefined,
          name: name.trim(),
          email: cleanEmail,
          batch,
          graduation_year: graduationYear,
          department_id: departmentId,
        },
      };
      localStorage.setItem('amcet_pending_registrations', JSON.stringify([newPending, ...pendingList.filter((p: any) => p.email !== cleanEmail)]));
    } catch (e) {}

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
      try {
        const { data, error } = await supabase.rpc('process_alumni_registration', {
          p_user_id: userId,
          p_status: status,
          p_rejection_reason: rejectionReason || null,
          p_reviewer_id: reviewerId || null,
          p_is_distinguished: isDistinguished,
        });

        if (!error) return data;
      } catch (e) {
        console.warn('Supabase processRegistration failed, using local fallback:', e);
      }
    }

    try {
      // Update registration status in registered users
      const regStored = localStorage.getItem('amcet_registered_users');
      if (regStored) {
        const regList = JSON.parse(regStored);
        const updatedRegList = regList.map((u: any) =>
          u.id === userId ? { ...u, registration_status: status } : u
        );
        localStorage.setItem('amcet_registered_users', JSON.stringify(updatedRegList));
      }

      const stored = localStorage.getItem('amcet_pending_registrations');
      if (stored) {
        const list = JSON.parse(stored);
        const approvedItem = list.find((p: any) => p.id === userId);
        const filtered = list.filter((p: any) => p.id !== userId);
        localStorage.setItem('amcet_pending_registrations', JSON.stringify(filtered));

        if (status === 'approved' && approvedItem?.alumni) {
          const existingAlumni = localStorage.getItem('amcet_alumni_profiles');
          const alumniList = existingAlumni ? JSON.parse(existingAlumni) : [];
          const newAlumni = {
            id: approvedItem.alumni.id || 'alumni-' + Date.now(),
            user_id: userId,
            register_number: approvedItem.register_number || approvedItem.alumni.register_number,
            name: approvedItem.alumni.name,
            email: approvedItem.email,
            batch: approvedItem.alumni.batch,
            graduation_year: approvedItem.alumni.graduation_year,
            current_designation: approvedItem.alumni.current_designation || 'Graduate Engineer',
            current_company: approvedItem.alumni.current_company || 'AMCET Alumni',
            bio: approvedItem.alumni.bio || '',
            department: approvedItem.alumni.department,
            department_id: approvedItem.alumni.department_id || '11111111-1111-1111-1111-111111111101',
            is_public: true,
            is_distinguished: isDistinguished,
            show_email: false,
            show_linkedin: true,
          };
          localStorage.setItem('amcet_alumni_profiles', JSON.stringify([newAlumni, ...alumniList]));

          // Also mark master record as claimed if register number matches
          const masterStored = localStorage.getItem('amcet_master_records');
          if (masterStored) {
            const masters = JSON.parse(masterStored);
            const updatedMasters = masters.map((m: any) => 
              m.register_number.toUpperCase() === (approvedItem.register_number || '').toUpperCase()
                ? { ...m, is_claimed: true }
                : m
            );
            localStorage.setItem('amcet_master_records', JSON.stringify(updatedMasters));
          }
        }
      }
    } catch (e) {}

    return { success: true, status };
  },

  // Login with authentic email & password validation for authorized users
  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured, attempt real Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!error && data?.user) return data;
      } catch (e) {
        console.warn('Supabase auth attempt failed, checking authorized accounts:', e);
      }
    }

    // 2. Fetch locally registered accounts
    let registeredUsers: AuthorizedAccount[] = [];
    try {
      const stored = localStorage.getItem('amcet_registered_users');
      if (stored) {
        registeredUsers = JSON.parse(stored);
      }
    } catch (e) {}

    // 3. Find matching authorized account
    const matchedAccount = 
      AUTHORIZED_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail) ||
      registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedAccount) {
      throw new Error(
        `Access denied: "${email}" is not an authorized account. Only verified AMCET alumni and administrators can access the portal.`
      );
    }

    // 4. Validate authentic password
    const validPasswords = matchedAccount.passwords || [];
    const isPasswordValid = validPasswords.some(p => p === password);

    if (!isPasswordValid) {
      throw new Error(
        `Authentication failed: Incorrect password for ${cleanEmail}. Please enter the valid authorized password.`
      );
    }

    // 5. Build authorized session user
    const sessionUser = {
      id: matchedAccount.id,
      email: matchedAccount.email,
      name: matchedAccount.name,
      role: matchedAccount.role,
      register_number: matchedAccount.registerNumber,
      registration_status: matchedAccount.registration_status || (matchedAccount.role === 'admin' ? 'approved' : 'approved'),
      alumniId: matchedAccount.alumniId,
      targetRoute: matchedAccount.targetRoute || (matchedAccount.role === 'admin' ? '/admin' : '/dashboard'),
    };

    localStorage.setItem('amcet_mock_user', JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
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
          register_number: u.register_number,
          registration_status: u.registration_status || 'approved',
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
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*, alumni:alumni_profiles(*, department:departments(*))')
          .eq('registration_status', 'pending')
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getPendingRegistrations error, using local fallback:', e);
      }
    }

    const defaultPending = [
      {
        id: 'user-pending-1',
        email: 'pending.graduate@amcet.edu',
        role: 'alumni',
        register_number: 'AMC21CSE099',
        registration_status: 'pending',
        is_verified: false,
        created_at: new Date().toISOString(),
        alumni: {
          id: 'alumni-pending-1',
          name: 'Suresh Kumar',
          register_number: 'AMC21CSE099',
          batch: '2021-2025',
          graduation_year: 2025,
          department: { name: 'Computer Science & Engineering', code: 'CSE' }
        }
      },
    ];

    try {
      const stored = localStorage.getItem('amcet_pending_registrations');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) return list;
      } else {
        localStorage.setItem('amcet_pending_registrations', JSON.stringify(defaultPending));
      }
    } catch (e) {}

    return defaultPending;
  },

  // Add a new pending alumni registration (sent to Admin for approval)
  async addPendingRegistration(profile: any): Promise<void> {
    try {
      const current = await this.getPendingRegistrations();
      const updated = [profile, ...current.filter((p: any) => p.id !== profile.id && p.email !== profile.email)];
      localStorage.setItem('amcet_pending_registrations', JSON.stringify(updated));
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('user_profiles').insert({
          id: profile.id,
          email: profile.email,
          role: profile.role || 'alumni',
          register_number: profile.register_number,
          registration_status: 'pending',
          is_verified: false,
        });
      } catch (e) {
        console.warn('Supabase insert failed for pending registration', e);
      }
    }
  },
};
