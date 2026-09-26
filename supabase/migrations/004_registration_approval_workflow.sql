-- Migration 004: Admin Registration Approval & Verification Workflow

-- 1. Function for User Self-Registration (Creates pending registration)
CREATE OR REPLACE FUNCTION public.register_alumni_user(
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT,
    p_register_number TEXT DEFAULT NULL,
    p_department_id UUID DEFAULT NULL,
    p_batch TEXT DEFAULT NULL,
    p_graduation_year INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_alumni_id UUID;
BEGIN
    p_email := TRIM(LOWER(p_email));
    p_register_number := TRIM(UPPER(COALESCE(p_register_number, '')));

    -- Create user profile with pending registration status
    INSERT INTO public.user_profiles (
        id,
        email,
        role,
        register_number,
        registration_status,
        is_verified
    ) VALUES (
        p_user_id,
        p_email,
        'alumni',
        NULLIF(p_register_number, ''),
        'pending',
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET updated_at = NOW()
    RETURNING id INTO p_user_id;

    -- Create inactive alumni profile pending admin approval
    INSERT INTO public.alumni_profiles (
        user_id,
        register_number,
        name,
        department_id,
        batch,
        graduation_year,
        email,
        show_email,
        show_linkedin,
        is_public
    ) VALUES (
        p_user_id,
        NULLIF(p_register_number, ''),
        p_name,
        p_department_id,
        p_batch,
        p_graduation_year,
        p_email,
        FALSE,
        TRUE,
        FALSE -- Inactive until admin approval
    )
    ON CONFLICT (user_id) DO UPDATE
    SET name = EXCLUDED.name, department_id = EXCLUDED.department_id, batch = EXCLUDED.batch
    RETURNING id INTO v_alumni_id;

    -- Notify user of pending approval
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
        p_user_id,
        'Registration Submitted for Verification',
        'Your alumni account registration has been submitted and is currently pending college administrator review.',
        'registration'
    );

    RETURN jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'alumni_id', v_alumni_id,
        'status', 'pending'
    );
END;
$$;


-- 2. Admin Function to Approve or Reject Alumni Registration (With Distinguished Alumni option)
CREATE OR REPLACE FUNCTION public.process_alumni_registration(
    p_user_id UUID,
    p_status TEXT,
    p_rejection_reason TEXT DEFAULT NULL,
    p_reviewer_id UUID DEFAULT NULL,
    p_is_distinguished BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_status NOT IN ('approved', 'rejected', 'blocked') THEN
        RAISE EXCEPTION 'Invalid registration status specified.';
    END IF;

    IF p_status = 'approved' THEN
        -- Approve user profile
        UPDATE public.user_profiles
        SET registration_status = 'approved',
            is_verified = TRUE,
            rejection_reason = NULL,
            updated_at = NOW()
        WHERE id = p_user_id;

        -- Make alumni profile active in public directory and set distinguished flag
        UPDATE public.alumni_profiles
        SET is_public = TRUE,
            is_distinguished = COALESCE(p_is_distinguished, FALSE),
            updated_at = NOW()
        WHERE user_id = p_user_id;

        -- Notify user
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            p_user_id,
            'Registration Approved!',
            'Congratulations! Your AMCET alumni registration has been approved by college administrators. You now have full access to your alumni dashboard.',
            'verification'
        );

    ELSIF p_status = 'rejected' THEN
        UPDATE public.user_profiles
        SET registration_status = 'rejected',
            is_verified = FALSE,
            rejection_reason = p_rejection_reason,
            updated_at = NOW()
        WHERE id = p_user_id;

        UPDATE public.alumni_profiles
        SET is_public = FALSE,
            updated_at = NOW()
        WHERE user_id = p_user_id;

        -- Notify user
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            p_user_id,
            'Registration Request Rejected',
            CONCAT('Your alumni registration request was not approved. Reason: ', COALESCE(p_rejection_reason, 'Information could not be verified.')),
            'verification'
        );
    END IF;

    -- Audit log entry
    INSERT INTO public.audit_logs (actor_user_id, action, entity_type, entity_id, new_data)
    VALUES (
        p_reviewer_id,
        CONCAT('REGISTRATION_', UPPER(p_status)),
        'user_profiles',
        p_user_id,
        jsonb_build_object('status', p_status, 'rejection_reason', p_rejection_reason, 'is_distinguished', p_is_distinguished)
    );

    RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'status', p_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_alumni_user(UUID, TEXT, TEXT, TEXT, UUID, TEXT, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.process_alumni_registration(UUID, TEXT, TEXT, UUID, BOOLEAN) TO authenticated, service_role;
