import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Notification } from '../types/database';

export const notificationService = {
  // Fetch Notifications for a specific User
  async getUserNotifications(userId: string): Promise<Notification[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data as Notification[];
    }

    // Local mock notifications
    return [
      {
        id: 'notif-1',
        user_id: userId,
        title: 'Welcome to AMCET Alumni Network',
        message: 'Your official profile has been verified and linked to your account.',
        type: 'registration',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ];
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) console.error('Failed to mark notification read:', error);
    }
  },

  // Send a new notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'registration' | 'update_request' | 'update_approved' | 'update_rejected' | 'verification'
  ) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('notifications')
        .insert({ user_id: userId, title, message, type });

      if (error) console.error('Failed to create notification:', error);
    }
  },
};
