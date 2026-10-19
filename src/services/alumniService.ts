import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlumniProfile, Department, Company, Industry, CareerExperience, Achievement } from '../types/database';

// Sample Mock Data for Offline/Development Mode
export const SAMPLE_DEPARTMENTS: Department[] = [
  { id: '11111111-1111-1111-1111-111111111101', name: 'Computer Science & Engineering', code: 'CSE', is_active: true },
  { id: '11111111-1111-1111-1111-111111111102', name: 'Information Technology', code: 'IT', is_active: true },
  { id: '11111111-1111-1111-1111-111111111103', name: 'Electronics & Communication Engineering', code: 'ECE', is_active: true },
  { id: '11111111-1111-1111-1111-111111111104', name: 'Mechanical Engineering', code: 'MECH', is_active: true },
  { id: '11111111-1111-1111-1111-111111111105', name: 'Electrical and Electronics Engineering', code: 'EEE', is_active: true },
  { id: '11111111-1111-1111-1111-111111111106', name: 'Civil Engineering', code: 'CIVIL', is_active: true },
  { id: '11111111-1111-1111-1111-111111111107', name: 'Master of Business Administration', code: 'MBA', is_active: true },
  { id: '11111111-1111-1111-1111-111111111108', name: 'Master of Computer Applications', code: 'MCA', is_active: true },
  { id: '11111111-1111-1111-1111-111111111109', name: 'Artificial Intelligence and Data Science', code: 'AIDS', is_active: true },
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
  company_search?: string;
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

  // Fetch ALL Alumni Profiles (including hidden ones, for Admin Management)
  async getAllAlumniProfiles(filters?: DirectoryFilters): Promise<AlumniProfile[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('alumni_profiles')
          .select('*, department:departments(*), company:companies(*)');

        if (filters?.department_id) {
          query = query.eq('department_id', filters.department_id);
        }
        if (filters?.batch) {
          query = query.eq('batch', filters.batch);
        }
        if (filters?.company_id) {
          query = query.eq('company_id', filters.company_id);
        }
        if (filters?.company_search) {
          const s = `%${filters.company_search}%`;
          query = query.ilike('current_company', s);
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
    let localCustom: AlumniProfile[] = [];
    try {
      const stored = localStorage.getItem('amcet_alumni_profiles');
      if (stored) {
        localCustom = JSON.parse(stored);
      }
    } catch (e) {}

    let list = [...localCustom, ...SAMPLE_ALUMNI.filter(s => !localCustom.some(c => c.id === s.id || (c.register_number && c.register_number === s.register_number)))];

    if (filters?.department_id) {
      list = list.filter((a) => a.department_id === filters.department_id);
    }
    if (filters?.batch) {
      list = list.filter((a) => a.batch === filters.batch);
    }
    if (filters?.company_id) {
      list = list.filter((a) => a.company_id === filters.company_id);
    }
    if (filters?.company_search) {
      const term = filters.company_search.toLowerCase();
      list = list.filter((a) => a.current_company && a.current_company.toLowerCase().includes(term));
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
      is_public: a.is_public !== false, // default true unless explicitly false
      department: SAMPLE_DEPARTMENTS.find((d) => d.id === a.department_id) || a.department || null,
      company: SAMPLE_COMPANIES.find((c) => c.id === a.company_id) || a.company || null,
    }));
  },

  // Fetch Public Alumni Profiles with Filters & Search (for Public Directory)
  async getPublicAlumniProfiles(filters?: DirectoryFilters): Promise<AlumniProfile[]> {
    const list = await this.getAllAlumniProfiles(filters);
    return list.filter((a) => a.is_public !== false);
  },

  // Fetch Distinguished Alumni
  async getDistinguishedAlumni(): Promise<AlumniProfile[]> {
    const list = await this.getPublicAlumniProfiles();
    return list.filter((a) => a.is_distinguished);
  },

  // Get Alumni Profile by User ID (respective profile per authorized user)
  async getAlumniProfileByUserId(userId: string): Promise<AlumniProfile | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('alumni_profiles')
          .select('*, department:departments(*), company:companies(*)')
          .eq('user_id', userId)
          .single();
        if (!error && data) return data as AlumniProfile;
      } catch (e) {}
    }

    // 1. Check custom approved alumni in localStorage
    try {
      const customStored = localStorage.getItem('amcet_alumni_profiles');
      if (customStored) {
        const customList: AlumniProfile[] = JSON.parse(customStored);
        const match = customList.find(
          (a) => a.user_id === userId || a.id === userId || (a.register_number && a.register_number === userId)
        );
        if (match) {
          return {
            ...match,
            department: SAMPLE_DEPARTMENTS.find((d) => d.id === match.department_id) || match.department || null,
            company: SAMPLE_COMPANIES.find((c) => c.id === match.company_id) || match.company || null,
          };
        }
      }
    } catch (e) {}

    // 2. Check logged-in user context
    let targetAlumniId = '';
    let targetEmail = '';
    let targetRegNo = '';
    try {
      const storedUser = localStorage.getItem('amcet_mock_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        targetAlumniId = u.alumniId || '';
        targetEmail = (u.email || '').toLowerCase();
        targetRegNo = (u.register_number || u.registerNumber || '').toUpperCase();
      }
    } catch (e) {}

    // 3. Match in SAMPLE_ALUMNI
    const matchedSample = SAMPLE_ALUMNI.find(
      (a) =>
        a.user_id === userId ||
        a.id === userId ||
        (targetAlumniId && a.id === targetAlumniId) ||
        (targetEmail && a.email && a.email.toLowerCase() === targetEmail) ||
        (targetRegNo && a.register_number && a.register_number.toUpperCase() === targetRegNo)
    );

    if (matchedSample) {
      return {
        ...matchedSample,
        department: SAMPLE_DEPARTMENTS.find((d) => d.id === matchedSample.department_id) || null,
        company: SAMPLE_COMPANIES.find((c) => c.id === matchedSample.company_id) || null,
      };
    }

    return null;
  },

  // Fetch Career Experiences for respective alumni
  async getCareerExperiences(alumniId: string): Promise<CareerExperience[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('career_experiences')
          .select('*')
          .eq('alumni_id', alumniId)
          .order('start_date', { ascending: false });
        if (!error && data && data.length > 0) return data as CareerExperience[];
      } catch (e) {
        console.warn('Supabase fetch failed for career_experiences', e);
      }
    }

    try {
      const local = localStorage.getItem(`amcet_career_${alumniId}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Specific verified career experience timelines
    const SAMPLE_EXPERIENCES: Record<string, CareerExperience[]> = {
      // Arun Kumar (Zoho)
      '44444444-4444-4444-4444-444444444401': [
        {
          id: 'exp-arun-1',
          alumni_id: alumniId,
          designation: 'Software Engineer',
          company_name: 'Zoho Corporation',
          start_date: '2025-06-01',
          is_current: true,
          description: 'Building cloud infrastructure and microservices on Zoho Catalyst platform.',
        },
        {
          id: 'exp-arun-2',
          alumni_id: alumniId,
          designation: 'Software Engineering Intern',
          company_name: 'TCS',
          start_date: '2024-05-01',
          end_date: '2024-11-30',
          is_current: false,
          description: 'Assisted in full-stack web development and REST API integration.',
        },
      ],
      // Priya Sharma (TCS)
      '44444444-4444-4444-4444-444444444402': [
        {
          id: 'exp-priya-1',
          alumni_id: alumniId,
          designation: 'Software Developer',
          company_name: 'Tata Consultancy Services (TCS)',
          start_date: '2025-07-01',
          is_current: true,
          description: 'Developing high-performance responsive web applications with React, TypeScript, and TailwindCSS.',
        },
        {
          id: 'exp-priya-2',
          alumni_id: alumniId,
          designation: 'Frontend Engineering Intern',
          company_name: 'Cognizant',
          start_date: '2024-06-01',
          end_date: '2024-12-15',
          is_current: false,
          description: 'Created accessible component libraries and interactive mockups.',
        },
      ],
      // Rahul Kumar (Deloitte)
      '44444444-4444-4444-4444-444444444403': [
        {
          id: 'exp-rahul-1',
          alumni_id: alumniId,
          designation: 'Business Analyst',
          company_name: 'Deloitte Consulting',
          start_date: '2024-08-01',
          is_current: true,
          description: 'Specializing in financial technology analytics, business intelligence, and client advisory.',
        },
        {
          id: 'exp-rahul-2',
          alumni_id: alumniId,
          designation: 'Risk Advisory Intern',
          company_name: 'Ernst & Young (EY)',
          start_date: '2023-06-01',
          end_date: '2024-01-31',
          is_current: false,
          description: 'Performed data audits and risk compliance reporting.',
        },
      ],
      // Meena Raj (Microsoft)
      '44444444-4444-4444-4444-444444444404': [
        {
          id: 'exp-meena-1',
          alumni_id: alumniId,
          designation: 'Software Engineer',
          company_name: 'Microsoft',
          start_date: '2023-09-01',
          is_current: true,
          description: 'Distributed cloud systems engineering on Microsoft Azure compute platforms.',
        },
        {
          id: 'exp-meena-2',
          alumni_id: alumniId,
          designation: 'Software Engineering Intern',
          company_name: 'Microsoft',
          start_date: '2022-05-01',
          end_date: '2022-08-31',
          is_current: false,
          description: 'Engineered backend microservices and telemetry monitoring tools.',
        },
      ],
    };

    if (SAMPLE_EXPERIENCES[alumniId]) {
      return SAMPLE_EXPERIENCES[alumniId];
    }

    return [
      {
        id: 'exp-default-1',
        alumni_id: alumniId,
        designation: 'Graduate Engineer',
        company_name: 'AMCET Alumni Partner',
        start_date: '2024-06-01',
        is_current: true,
        description: 'Engineering and professional project development.',
      },
    ];
  },

  // Save Career Experiences
  async saveCareerExperiences(alumniId: string, experiences: CareerExperience[]): Promise<void> {
    try {
      localStorage.setItem(`amcet_career_${alumniId}`, JSON.stringify(experiences));
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('career_experiences').upsert(experiences);
      } catch (e) {
        console.warn('Supabase upsert failed for career_experiences', e);
      }
    }
  },

  // Fetch Achievements for respective alumni
  async getAchievements(alumniId: string): Promise<Achievement[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('alumni_id', alumniId)
          .order('year', { ascending: false });
        if (!error && data && data.length > 0) return data as Achievement[];
      } catch (e) {
        console.warn('Supabase fetch failed for achievements', e);
      }
    }

    try {
      const local = localStorage.getItem(`amcet_achievements_${alumniId}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Specific verified achievements
    const SAMPLE_ACHIEVEMENTS: Record<string, Achievement[]> = {
      // Arun Kumar
      '44444444-4444-4444-4444-444444444401': [
        {
          id: 'ach-arun-1',
          alumni_id: alumniId,
          title: 'Best Outstanding Student Award',
          organization: 'AMCET College Day 2025',
          year: 2025,
          description: 'Awarded for academic excellence and leadership in technical symposiums.',
        },
      ],
      // Priya Sharma
      '44444444-4444-4444-4444-444444444402': [
        {
          id: 'ach-priya-1',
          alumni_id: alumniId,
          title: 'Grace Hopper Celebration India Scholar',
          organization: 'AnitaB.org India',
          year: 2024,
          description: 'Selected among top engineering women in India for excellence in frontend architecture.',
        },
        {
          id: 'ach-priya-2',
          alumni_id: alumniId,
          title: 'Smart India Hackathon Finalist',
          organization: 'Ministry of Education, Govt of India',
          year: 2023,
          description: 'Developed an AI-assisted portal for citizen grievance redressal.',
        },
      ],
      // Rahul Kumar
      '44444444-4444-4444-4444-444444444403': [
        {
          id: 'ach-rahul-1',
          alumni_id: alumniId,
          title: 'Best Paper Presentation Award',
          organization: 'IEEE International Conference (ICETET)',
          year: 2024,
          description: 'Published research paper on predictive financial analytics and risk intelligence.',
        },
      ],
      // Meena Raj
      '44444444-4444-4444-4444-444444444404': [
        {
          id: 'ach-meena-1',
          alumni_id: alumniId,
          title: 'Microsoft Global Hackathon Runner Up',
          organization: 'Microsoft Corporation',
          year: 2023,
          description: 'Built high-throughput telemetry ingestion pipeline for cloud diagnostics.',
        },
        {
          id: 'ach-meena-2',
          alumni_id: alumniId,
          title: 'Distinguished Academic Excellence Medal',
          organization: 'AMCET Convocation 2023',
          year: 2023,
          description: 'Graduated first in Department of Information Technology with highest GPA.',
        },
      ],
    };

    if (SAMPLE_ACHIEVEMENTS[alumniId]) {
      return SAMPLE_ACHIEVEMENTS[alumniId];
    }

    return [
      {
        id: 'ach-default-1',
        alumni_id: alumniId,
        title: 'Academic & Professional Excellence Award',
        organization: 'AMCET Alumni Association',
        year: 2024,
        description: 'Recognized for continued dedication and professional achievements in the industry.',
      },
    ];
  },

  // Save Achievements
  async saveAchievements(alumniId: string, achievements: Achievement[]): Promise<void> {
    try {
      localStorage.setItem(`amcet_achievements_${alumniId}`, JSON.stringify(achievements));
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('achievements').upsert(achievements);
      } catch (e) {
        console.warn('Supabase upsert failed for achievements', e);
      }
    }
  },
};
