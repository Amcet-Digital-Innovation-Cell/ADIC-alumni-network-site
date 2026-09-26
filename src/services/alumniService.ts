import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlumniProfile, Department, Company, Industry, CareerExperience, Achievement } from '../types/database';

// Sample Mock Data for Offline/Development Mode
export const SAMPLE_DEPARTMENTS: Department[] = [
  { id: '11111111-1111-1111-1111-111111111101', name: 'Computer Science & Engineering', code: 'CSE', is_active: true },
  { id: '11111111-1111-1111-1111-111111111102', name: 'Information Technology', code: 'IT', is_active: true },
  { id: '11111111-1111-1111-1111-111111111103', name: 'Electronics & Communication Engineering', code: 'ECE', is_active: true },
  { id: '11111111-1111-1111-1111-111111111104', name: 'Mechanical Engineering', code: 'MECH', is_active: true },
];

export const SAMPLE_INDUSTRIES: Industry[] = [
  { id: '22222222-2222-2222-2222-222222222201', name: 'Software', description: 'Software Development & IT Services', is_active: true },
  { id: '22222222-2222-2222-2222-222222222202', name: 'Finance', description: 'Financial Services & Consulting', is_active: true },
  { id: '22222222-2222-2222-2222-222222222203', name: 'Healthcare', description: 'Healthcare & Medical Technology', is_active: true },
  { id: '22222222-2222-2222-2222-222222222204', name: 'Manufacturing', description: 'Industrial & Mechanical Manufacturing', is_active: true },
];

export const SAMPLE_COMPANIES: Company[] = [
  { id: '33333333-3333-3333-3333-333333333301', name: 'TCS', industry_id: '22222222-2222-2222-2222-222222222201', website: 'https://tcs.com' },
  { id: '33333333-3333-3333-3333-333333333302', name: 'Infosys', industry_id: '22222222-2222-2222-2222-222222222201', website: 'https://infosys.com' },
  { id: '33333333-3333-3333-3333-333333333303', name: 'Zoho', industry_id: '22222222-2222-2222-2222-222222222201', website: 'https://zoho.com' },
  { id: '33333333-3333-3333-3333-333333333304', name: 'Microsoft', industry_id: '22222222-2222-2222-2222-222222222201', website: 'https://microsoft.com' },
  { id: '33333333-3333-3333-3333-333333333305', name: 'Deloitte', industry_id: '22222222-2222-2222-2222-222222222202', website: 'https://deloitte.com' },
  { id: '33333333-3333-3333-3333-333333333306', name: 'Amazon', industry_id: '22222222-2222-2222-2222-222222222201', website: 'https://amazon.com' },
];

export const SAMPLE_ALUMNI: AlumniProfile[] = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    user_id: '00000000-0000-0000-0000-000000000001',
    register_number: 'AMC21CSE001',
    name: 'Arun Kumar',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    department_id: '11111111-1111-1111-1111-111111111101',
    batch: '2021-2025',
    graduation_year: 2025,
    company_id: '33333333-3333-3333-3333-333333333303',
    current_company: 'Zoho',
    current_designation: 'Software Engineer',
    location: 'Chennai, India',
    bio: 'Full-stack developer passionate about building scalable cloud apps.',
    linkedin_url: 'https://linkedin.com/in/arunkumar-amcet',
    email: 'arun.sample@amcet.edu',
    show_email: false,
    show_linkedin: true,
    is_public: true,
    is_distinguished: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444402',
    user_id: '00000000-0000-0000-0000-000000000002',
    register_number: 'AMC21CSE002',
    name: 'Priya Sharma',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    department_id: '11111111-1111-1111-1111-111111111101',
    batch: '2021-2025',
    graduation_year: 2025,
    company_id: '33333333-3333-3333-3333-333333333301',
    current_company: 'TCS',
    current_designation: 'Software Developer',
    location: 'Bengaluru, India',
    bio: 'Frontend engineer focused on React and modern UI/UX design systems.',
    linkedin_url: 'https://linkedin.com/in/priyasharma-amcet',
    email: 'priya.sample@amcet.edu',
    show_email: false,
    show_linkedin: true,
    is_public: true,
    is_distinguished: false,
  },
  {
    id: '44444444-4444-4444-4444-444444444403',
    user_id: '00000000-0000-0000-0000-000000000003',
    register_number: 'AMC20ECE015',
    name: 'Rahul Kumar',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    department_id: '11111111-1111-1111-1111-111111111103',
    batch: '2020-2024',
    graduation_year: 2024,
    company_id: '33333333-3333-3333-3333-333333333305',
    current_company: 'Deloitte',
    current_designation: 'Business Analyst',
    location: 'Hyderabad, India',
    bio: 'Analyst specializing in data analytics and financial technology solutions.',
    linkedin_url: 'https://linkedin.com/in/rahulkumar-amcet',
    email: 'rahul.sample@amcet.edu',
    show_email: false,
    show_linkedin: true,
    is_public: true,
    is_distinguished: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444404',
    user_id: '00000000-0000-0000-0000-000000000004',
    register_number: 'AMC19IT008',
    name: 'Meena Raj',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    department_id: '11111111-1111-1111-1111-111111111102',
    batch: '2019-2023',
    graduation_year: 2023,
    company_id: '33333333-3333-3333-3333-333333333304',
    current_company: 'Microsoft',
    current_designation: 'Software Engineer',
    location: 'Seattle, USA',
    bio: 'Cloud systems engineer working on distributed cloud backend architecture.',
    linkedin_url: 'https://linkedin.com/in/meenaraj-amcet',
    email: 'meena.sample@amcet.edu',
    show_email: false,
    show_linkedin: true,
    is_public: true,
    is_distinguished: true,
  },
];

export interface DirectoryFilters {
  search?: string;
  department_id?: string;
  batch?: string;
  company_id?: string;
  industry_id?: string;
}

export const alumniService = {
  // Fetch Departments
  async getDepartments(): Promise<Department[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('departments').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) return data as Department[];
    }
    return SAMPLE_DEPARTMENTS;
  },

  // Fetch Industries
  async getIndustries(): Promise<Industry[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('industries').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) return data as Industry[];
    }
    return SAMPLE_INDUSTRIES;
  },

  // Fetch Companies
  async getCompanies(): Promise<Company[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('companies').select('*, industry:industries(*)');
      if (!error && data && data.length > 0) return data as Company[];
    }
    return SAMPLE_COMPANIES;
  },

  // Fetch Public Alumni Profiles with Filters & Search
  async getPublicAlumniProfiles(filters?: DirectoryFilters): Promise<AlumniProfile[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('alumni_profiles')
          .select('*, department:departments(*), company:companies(*)')
          .eq('is_public', true);

        if (filters?.department_id) {
          query = query.eq('department_id', filters.department_id);
        }
        if (filters?.batch) {
          query = query.eq('batch', filters.batch);
        }
        if (filters?.company_id) {
          query = query.eq('company_id', filters.company_id);
        }
        if (filters?.search) {
          const s = `%${filters.search}%`;
          query = query.or(`name.ilike.${s},current_designation.ilike.${s},bio.ilike.${s}`);
        }

        const { data, error } = await query;
        if (!error && data) return data as AlumniProfile[];
      } catch (err) {
        console.warn('Supabase fetch failed, returning sample alumni:', err);
      }
    }

    // Filter local sample data
    let list = [...SAMPLE_ALUMNI];

    if (filters?.department_id) {
      list = list.filter((a) => a.department_id === filters.department_id);
    }
    if (filters?.batch) {
      list = list.filter((a) => a.batch === filters.batch);
    }
    if (filters?.company_id) {
      list = list.filter((a) => a.company_id === filters.company_id);
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          (a.current_designation && a.current_designation.toLowerCase().includes(term)) ||
          (a.current_company && a.current_company.toLowerCase().includes(term))
      );
    }

    // Attach mock department & company references
    return list.map((a) => ({
      ...a,
      department: SAMPLE_DEPARTMENTS.find((d) => d.id === a.department_id) || null,
      company: SAMPLE_COMPANIES.find((c) => c.id === a.company_id) || null,
    }));
  },

  // Fetch Distinguished Alumni
  async getDistinguishedAlumni(): Promise<AlumniProfile[]> {
    const list = await this.getPublicAlumniProfiles();
    return list.filter((a) => a.is_distinguished);
  },

  // Get Alumni Profile by User ID
  async getAlumniProfileByUserId(userId: string): Promise<AlumniProfile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*, department:departments(*), company:companies(*)')
        .eq('user_id', userId)
        .single();
      if (!error && data) return data as AlumniProfile;
    }

    // Fallback sample
    const sample = SAMPLE_ALUMNI[0];
    return {
      ...sample,
      user_id: userId,
      department: SAMPLE_DEPARTMENTS.find((d) => d.id === sample.department_id) || null,
      company: SAMPLE_COMPANIES.find((c) => c.id === sample.company_id) || null,
    };
  },

  // Fetch Career Experiences
  async getCareerExperiences(alumniId: string): Promise<CareerExperience[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('career_experiences')
        .select('*')
        .eq('alumni_id', alumniId)
        .order('start_date', { ascending: false });
      if (!error && data) return data as CareerExperience[];
    }
    return [
      {
        id: 'exp-1',
        alumni_id: alumniId,
        designation: 'Software Engineer',
        company_name: 'Zoho Corporation',
        start_date: '2025-06-01',
        is_current: true,
        description: 'Building cloud infrastructure and microservices.',
      },
      {
        id: 'exp-2',
        alumni_id: alumniId,
        designation: 'Software Engineering Intern',
        company_name: 'TCS',
        start_date: '2024-05-01',
        end_date: '2024-11-30',
        is_current: false,
        description: 'Assisted in web development and API integration.',
      },
    ];
  },

  // Fetch Achievements
  async getAchievements(alumniId: string): Promise<Achievement[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('alumni_id', alumniId)
        .order('year', { ascending: false });
      if (!error && data) return data as Achievement[];
    }
    return [
      {
        id: 'ach-1',
        alumni_id: alumniId,
        title: 'Best Outstanding Student Award',
        organization: 'AMCET College Day 2025',
        year: 2025,
        description: 'Awarded for academic excellence and leadership in technical symposiums.',
      },
    ];
  },
};
