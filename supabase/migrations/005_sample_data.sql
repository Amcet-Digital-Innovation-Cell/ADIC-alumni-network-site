-- Migration 005: Sample Development Data & Registration Approval Testing

-- 1. Insert Departments
INSERT INTO public.departments (id, name, code) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Computer Science & Engineering', 'CSE'),
    ('11111111-1111-1111-1111-111111111102', 'Information Technology', 'IT'),
    ('11111111-1111-1111-1111-111111111103', 'Electronics & Communication Engineering', 'ECE'),
    ('11111111-1111-1111-1111-111111111104', 'Mechanical Engineering', 'MECH')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Industries
INSERT INTO public.industries (id, name, description) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Software', 'Software Development & IT Services'),
    ('22222222-2222-2222-2222-222222222202', 'Finance', 'Financial Services & Consulting'),
    ('22222222-2222-2222-2222-222222222203', 'Healthcare', 'Healthcare & Medical Technology'),
    ('22222222-2222-2222-2222-222222222204', 'Manufacturing', 'Industrial & Mechanical Manufacturing'),
    ('22222222-2222-2222-2222-222222222205', 'Education', 'Academia & E-Learning Solutions')
ON CONFLICT (name) DO NOTHING;

-- 3. Insert Companies
INSERT INTO public.companies (id, name, industry_id, website) VALUES
    ('33333333-3333-3333-3333-333333333301', 'TCS', '22222222-2222-2222-2222-222222222201', 'https://tcs.com'),
    ('33333333-3333-3333-3333-333333333302', 'Infosys', '22222222-2222-2222-2222-222222222201', 'https://infosys.com'),
    ('33333333-3333-3333-3333-333333333303', 'Zoho', '22222222-2222-2222-2222-222222222201', 'https://zoho.com'),
    ('33333333-3333-3333-3333-333333333304', 'Microsoft', '22222222-2222-2222-2222-222222222201', 'https://microsoft.com'),
    ('33333333-3333-3333-3333-333333333305', 'Deloitte', '22222222-2222-2222-2222-222222222202', 'https://deloitte.com'),
    ('33333333-3333-3333-3333-333333333306', 'Amazon', '22222222-2222-2222-2222-222222222201', 'https://amazon.com')
ON CONFLICT DO NOTHING;

-- 4. Sample Alumni Master Dataset (Optional Verification Source)
INSERT INTO public.alumni_master (register_number, name, department_id, batch, graduation_year, registered_email, is_claimed) VALUES
    ('AMC21CSE001', 'Arun Kumar', '11111111-1111-1111-1111-111111111101', '2021-2025', 2025, 'arun.sample@amcet.edu', TRUE),
    ('AMC21CSE002', 'Priya Sharma', '11111111-1111-1111-1111-111111111101', '2021-2025', 2025, 'priya.sample@amcet.edu', TRUE),
    ('AMC20ECE015', 'Rahul Kumar', '11111111-1111-1111-1111-111111111103', '2020-2024', 2024, 'rahul.sample@amcet.edu', TRUE),
    ('AMC19IT008', 'Meena Raj', '11111111-1111-1111-1111-111111111102', '2019-2023', 2023, 'meena.sample@amcet.edu', TRUE)
ON CONFLICT (register_number) DO NOTHING;

-- 5. Seed Auth Users (Satisfies user_profiles Foreign Key)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
) VALUES
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'arun.sample@amcet.edu', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Arun Kumar"}', FALSE, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'priya.sample@amcet.edu', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Priya Sharma"}', FALSE, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'rahul.sample@amcet.edu', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Rahul Kumar"}', FALSE, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'meena.sample@amcet.edu', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Meena Raj"}', FALSE, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'pending.graduate@amcet.edu', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Pending Student"}', FALSE, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000099', 'authenticated', 'authenticated', 'admin@amcet.in', '$2a$10$abcdefghijklmnopqrstuu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"AMCET Admin"}', TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Approved User Profiles
INSERT INTO public.user_profiles (id, email, role, register_number, registration_status, is_verified) VALUES
    ('00000000-0000-0000-0000-000000000001', 'arun.sample@amcet.edu', 'alumni', 'AMC21CSE001', 'approved', TRUE),
    ('00000000-0000-0000-0000-000000000002', 'priya.sample@amcet.edu', 'alumni', 'AMC21CSE002', 'approved', TRUE),
    ('00000000-0000-0000-0000-000000000003', 'rahul.sample@amcet.edu', 'alumni', 'AMC20ECE015', 'approved', TRUE),
    ('00000000-0000-0000-0000-000000000004', 'meena.sample@amcet.edu', 'alumni', 'AMC19IT008', 'approved', TRUE),
    ('00000000-0000-0000-0000-000000000005', 'pending.graduate@amcet.edu', 'alumni', 'AMC21CSE099', 'pending', FALSE),
    ('00000000-0000-0000-0000-000000000099', 'admin@amcet.in', 'admin', 'ADMIN001', 'approved', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Approved Public Alumni Profiles
INSERT INTO public.alumni_profiles (
    id, user_id, register_number, name, photo_url, department_id, batch, graduation_year, company_id, current_company, current_designation, location, bio, linkedin_url, email, show_email, show_linkedin, is_public, is_distinguished
) VALUES
    (
        '44444444-4444-4444-4444-444444444401',
        '00000000-0000-0000-0000-000000000001',
        'AMC21CSE001',
        'Arun Kumar',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        '11111111-1111-1111-1111-111111111101',
        '2021-2025',
        2025,
        '33333333-3333-3333-3333-333333333303',
        'Zoho',
        'Software Engineer',
        'Chennai, India',
        'Full-stack developer passionate about building scalable cloud apps.',
        'https://linkedin.com/in/arunkumar-amcet',
        'arun.sample@amcet.edu',
        FALSE,
        TRUE,
        TRUE,
        TRUE
    ),
    (
        '44444444-4444-4444-4444-444444444402',
        '00000000-0000-0000-0000-000000000002',
        'AMC21CSE002',
        'Priya Sharma',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        '11111111-1111-1111-1111-111111111101',
        '2021-2025',
        2025,
        '33333333-3333-3333-3333-333333333301',
        'TCS',
        'Software Developer',
        'Bengaluru, India',
        'Frontend engineer focused on React and modern UI/UX design systems.',
        'https://linkedin.com/in/priyasharma-amcet',
        'priya.sample@amcet.edu',
        FALSE,
        TRUE,
        TRUE,
        FALSE
    ),
    (
        '44444444-4444-4444-4444-444444444403',
        '00000000-0000-0000-0000-000000000003',
        'AMC20ECE015',
        'Rahul Kumar',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        '11111111-1111-1111-1111-111111111103',
        '2020-2024',
        2024,
        '33333333-3333-3333-3333-333333333305',
        'Deloitte',
        'Business Analyst',
        'Hyderabad, India',
        'Analyst specializing in data analytics and financial technology solutions.',
        'https://linkedin.com/in/rahulkumar-amcet',
        'rahul.sample@amcet.edu',
        FALSE,
        TRUE,
        TRUE,
        TRUE
    ),
    (
        '44444444-4444-4444-4444-444444444404',
        '00000000-0000-0000-0000-000000000004',
        'AMC19IT008',
        'Meena Raj',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        '11111111-1111-1111-1111-111111111102',
        '2019-2023',
        2023,
        '33333333-3333-3333-3333-333333333304',
        'Microsoft',
        'Software Engineer',
        'Seattle, USA',
        'Cloud systems engineer working on distributed cloud backend architecture.',
        'https://linkedin.com/in/meenaraj-amcet',
        'meena.sample@amcet.edu',
        FALSE,
        TRUE,
        TRUE,
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
