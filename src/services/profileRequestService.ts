import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProfileUpdateRequest } from '../types/database';

export const profileRequestService = {
  // Submit a new profile update request (Alumni Workflow)
  async submitProfileUpdateRequest(
    alumniId: string,
    requestedChanges: Record<string, any>,
    currentSnapshot: Record<string, any>
  ): Promise<ProfileUpdateRequest> {
    if (isSupabaseConfigured) {
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

      if (error) throw error;
      return data as ProfileUpdateRequest;
    }

    // Mock local request
    const mockReq: ProfileUpdateRequest = {
      id: 'req-' + Date.now(),
      alumni_id: alumniId,
      requested_changes: requestedChanges,
      current_snapshot: currentSnapshot,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const existingJson = localStorage.getItem('amcet_profile_requests');
    const requests = existingJson ? JSON.parse(existingJson) : [];
    requests.push(mockReq);
    localStorage.setItem('amcet_profile_requests', JSON.stringify(requests));

    return mockReq;
  },

  // Get all pending update requests (Admin Workflow)
  async getPendingRequests(): Promise<ProfileUpdateRequest[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profile_update_requests')
        .select('*, alumni:alumni_profiles(*)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) return data as ProfileUpdateRequest[];
    }

    // Local mock requests
    const existingJson = localStorage.getItem('amcet_profile_requests');
    if (existingJson) {
      const requests: ProfileUpdateRequest[] = JSON.parse(existingJson);
      return requests.filter((r) => r.status === 'pending');
    }

    return [
      {
        id: 'sample-req-1',
        alumni_id: '44444444-4444-4444-4444-444444444401',
        requested_changes: {
          current_designation: 'Senior Software Engineer',
          location: 'Chennai / Remote',
        },
        current_snapshot: {
          current_designation: 'Software Engineer',
          location: 'Chennai, India',
        },
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ];
  },

  // Admin process: Approve or Reject a request
  async processRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
    reviewerId?: string
  ) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('process_profile_update_request', {
        p_request_id: requestId,
        p_status: status,
        p_rejection_reason: rejectionReason || null,
        p_reviewer_id: reviewerId || null,
      });

      if (error) throw error;
      return data;
    }

    // Local mock processing
    const existingJson = localStorage.getItem('amcet_profile_requests');
    if (existingJson) {
      const requests: ProfileUpdateRequest[] = JSON.parse(existingJson);
      const req = requests.find((r) => r.id === requestId);
      if (req) {
        req.status = status;
        if (rejectionReason) req.rejection_reason = rejectionReason;
        localStorage.setItem('amcet_profile_requests', JSON.stringify(requests));
      }
    }
    return { success: true, status };
  },
};
