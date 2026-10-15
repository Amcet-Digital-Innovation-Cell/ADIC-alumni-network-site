import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProfileUpdateRequest } from '../types/database';
import { SAMPLE_ALUMNI } from './alumniService';

export const profileRequestService = {
  // Submit a new profile update request (Alumni or Admin Edit Workflow)
  async submitProfileUpdateRequest(
    alumniId: string,
    requestedChanges: Record<string, any>,
    currentSnapshot: Record<string, any>,
    alumniProfile?: any
  ): Promise<ProfileUpdateRequest> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profile_update_requests')
          .insert({
            alumni_id: alumniId,
            requested_changes: requestedChanges,
            current_snapshot: currentSnapshot,
            status: 'pending',
          })
          .select()
          .single();

        if (!error && data) return data as ProfileUpdateRequest;
      } catch (e) {
        console.warn('Supabase submitProfileUpdateRequest error, using local fallback:', e);
      }
    }

    // Mock local request
    const mockReq: ProfileUpdateRequest = {
      id: 'req-' + Date.now(),
      alumni_id: alumniId,
      requested_changes: requestedChanges,
      current_snapshot: currentSnapshot,
      status: 'pending',
      created_at: new Date().toISOString(),
      alumni: alumniProfile || null,
    };

    try {
      const existingJson = localStorage.getItem('amcet_profile_requests');
      const requests = existingJson ? JSON.parse(existingJson) : [];
      requests.unshift(mockReq);
      localStorage.setItem('amcet_profile_requests', JSON.stringify(requests));
    } catch (e) {}

    return mockReq;
  },

  // Get all pending update requests (Admin Workflow)
  async getPendingRequests(): Promise<ProfileUpdateRequest[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profile_update_requests')
          .select('*, alumni:alumni_profiles(*)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) return data as ProfileUpdateRequest[];
      } catch (e) {
        console.warn('Supabase getPendingRequests error, using local fallback:', e);
      }
    }

    // Local mock requests
    try {
      const existingJson = localStorage.getItem('amcet_profile_requests');
      if (existingJson) {
        const requests: ProfileUpdateRequest[] = JSON.parse(existingJson);
        const pending = requests.filter((r) => r.status === 'pending');
        return pending;
      }
    } catch (e) {}

    const defaultRequests: ProfileUpdateRequest[] = [
      {
        id: 'sample-req-1',
        alumni_id: '44444444-4444-4444-4444-444444444401',
        requested_changes: {
          current_designation: 'Senior Software Engineer',
          location: 'Chennai / Remote',
          bio: 'Senior cloud systems architect leading enterprise platform services.',
        },
        current_snapshot: {
          current_designation: 'Software Engineer',
          location: 'Chennai, India',
          bio: 'Full-stack developer passionate about building scalable cloud apps.',
        },
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ];

    try {
      localStorage.setItem('amcet_profile_requests', JSON.stringify(defaultRequests));
    } catch (e) {}

    return defaultRequests;
  },

  // Admin process: Approve or Reject a request
  async processRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
    reviewerId?: string
  ) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('process_profile_update_request', {
          p_request_id: requestId,
          p_status: status,
          p_rejection_reason: rejectionReason || null,
          p_reviewer_id: reviewerId || null,
        });

        if (!error) return data;
      } catch (e) {
        console.warn('Supabase processRequest error, using local fallback:', e);
      }
    }

    // Local mock processing & applying changes to alumni profile
    try {
      const existingJson = localStorage.getItem('amcet_profile_requests');
      if (existingJson) {
        const requests: ProfileUpdateRequest[] = JSON.parse(existingJson);
        const req = requests.find((r) => r.id === requestId);
        if (req) {
          req.status = status;
          if (rejectionReason) req.rejection_reason = rejectionReason;
          localStorage.setItem('amcet_profile_requests', JSON.stringify(requests));

          // When approved, apply requested changes directly to alumni profile!
          if (status === 'approved' && req.requested_changes) {
            const storedAlumni = localStorage.getItem('amcet_alumni_profiles');
            let alumniList = storedAlumni ? JSON.parse(storedAlumni) : [];
            const idx = alumniList.findIndex((a: any) => a.id === req.alumni_id);

            if (idx >= 0) {
              alumniList[idx] = { ...alumniList[idx], ...req.requested_changes };
            } else {
              const sample = SAMPLE_ALUMNI.find((s) => s.id === req.alumni_id);
              if (sample) {
                alumniList.push({ ...sample, ...req.requested_changes });
              } else {
                alumniList.push({
                  id: req.alumni_id,
                  ...(req.alumni || {}),
                  ...req.requested_changes,
                });
              }
            }
            localStorage.setItem('amcet_alumni_profiles', JSON.stringify(alumniList));
          }
        }
      }
    } catch (e) {}

    return { success: true, status };
  },
};
