import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { profileRequestService } from '../services/profileRequestService';
import { alumniService } from '../services/alumniService';
import { CareerExperience, Achievement } from '../types/database';
import { User, Bell, Briefcase, Award, Edit3, CheckCircle2, Lock, Clock, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, userProfile, alumniProfile } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications(user?.id);

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'career' | 'achievements'>('profile');
  const [experiences, setExperiences] = useState<CareerExperience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Profile Edit Request Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDesignation, setEditDesignation] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reqMessage, setReqMessage] = useState<string | null>(null);

  useEffect(() => {
    if (alumniProfile?.id) {
      alumniService.getCareerExperiences(alumniProfile.id).then(setExperiences);
      alumniService.getAchievements(alumniProfile.id).then(setAchievements);
      
      setEditDesignation(alumniProfile.current_designation || '');
      setEditLocation(alumniProfile.location || '');
      setEditBio(alumniProfile.bio || '');
      setEditLinkedin(alumniProfile.linkedin_url || '');
    }
  }, [alumniProfile]);

  const handleSubmitProfileRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniProfile) return;

    setSubmitting(true);
    setReqMessage(null);

    const requestedChanges = {
      current_designation: editDesignation,
      location: editLocation,
      bio: editBio,
      linkedin_url: editLinkedin,
    };

    const currentSnapshot = {
      current_designation: alumniProfile.current_designation,
      location: alumniProfile.location,
      bio: alumniProfile.bio,
      linkedin_url: alumniProfile.linkedin_url,
    };

    try {
      await profileRequestService.submitProfileUpdateRequest(alumniProfile.id, requestedChanges, currentSnapshot);
      setReqMessage('Profile update request submitted successfully! An administrator will review your changes shortly.');
      setShowEditModal(false);
    } catch (err: any) {
      setReqMessage(err.message || 'Failed to submit update request.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Pending Registration Screen
  if (userProfile?.registration_status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#B89B5E]/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#B89B5E]/20 text-[#B89B5E] border border-[#B89B5E]/40 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#F4EFE7]">Registration Pending Admin Verification</h2>
          <p className="text-xs text-[#A7A29B] leading-relaxed">
            Your alumni account (<strong className="text-[#F4EFE7]">{userProfile.email}</strong>) has been submitted and is currently pending review by Annai Mira College administrators.
          </p>
          <div className="p-4 rounded-xl bg-[#161616] border border-[#F4EFE7]/10 text-xs text-[#B89B5E]">
            Full dashboard access will be unlocked automatically once your registration status is updated to <strong>approved</strong>.
          </div>
        </div>
      </div>
    );
  }

  // 2. Rejected Registration Screen
  if (userProfile?.registration_status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/40 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#F4EFE7]">Registration Request Not Approved</h2>
          <p className="text-xs text-[#A7A29B]">
            Your alumni account registration could not be verified by college administrators.
          </p>
          {userProfile.rejection_reason && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
              <strong>Rejection Reason:</strong> {userProfile.rejection_reason}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!alumniProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#A7A29B]">
        <p className="text-sm">Loading alumni dashboard profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B89B5E]/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={
                  alumniProfile.photo_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(alumniProfile.name)}&background=6e1f32&color=f4efe7&bold=true`
                }
                alt={alumniProfile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#B89B5E] bg-[#161616]"
              />
              <CheckCircle2 className="w-5 h-5 text-[#B89B5E] bg-[#0D0D0D] rounded-full absolute bottom-0 right-0" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-bold text-2xl text-[#F4EFE7]">{alumniProfile.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-950/60 text-green-300 border border-green-500/30 font-mono">
                  Approved & Verified
                </span>
              </div>
              <p className="text-xs text-[#B89B5E] font-medium">
                {alumniProfile.current_designation || 'Software Professional'} • {alumniProfile.current_company || 'AMCET Graduate'}
              </p>
              <p className="text-xs text-[#A7A29B] font-mono">
                Register No: {alumniProfile.register_number || 'N/A'} • Batch: {alumniProfile.batch || 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-semibold flex items-center space-x-2 shadow-md transition-transform hover:scale-105"
          >
            <Edit3 className="w-4 h-4 text-[#B89B5E]" />
            <span>Request Profile Update</span>
          </button>
        </div>

        {reqMessage && (
          <div className="mt-4 p-3 rounded-xl bg-[#161616] border border-[#B89B5E]/40 text-xs text-[#B89B5E]">
            {reqMessage}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#F4EFE7]/10 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'profile' ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40' : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <User className="w-4 h-4 text-[#B89B5E]" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 relative ${
            activeTab === 'notifications' ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40' : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Bell className="w-4 h-4 text-[#B89B5E]" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'career' ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40' : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#B89B5E]" />
          <span>Career Journey</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'achievements' ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40' : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Award className="w-4 h-4 text-[#B89B5E]" />
          <span>Achievements</span>
        </button>
      </div>

      {/* Tab Content 1: Profile View */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#F4EFE7]/10 space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#F4EFE7] border-b border-[#F4EFE7]/10 pb-3">
              Official Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#A7A29B] block">Full Name</span>
                <span className="font-semibold text-[#F4EFE7]">{alumniProfile.name}</span>
              </div>
              <div>
                <span className="text-[#A7A29B] block">Register Number</span>
                <span className="font-mono font-semibold text-[#B89B5E]">{alumniProfile.register_number || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#A7A29B] block">Department</span>
                <span className="font-semibold text-[#F4EFE7]">{alumniProfile.department?.name || 'Engineering'}</span>
              </div>
              <div>
                <span className="text-[#A7A29B] block">Batch & Graduation</span>
                <span className="font-semibold text-[#F4EFE7]">{alumniProfile.batch} ({alumniProfile.graduation_year})</span>
              </div>
              <div>
                <span className="text-[#A7A29B] block">Current Designation</span>
                <span className="font-semibold text-[#F4EFE7]">{alumniProfile.current_designation || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#A7A29B] block">Location</span>
                <span className="font-semibold text-[#F4EFE7]">{alumniProfile.location || 'Not specified'}</span>
              </div>
            </div>

            {alumniProfile.bio && (
              <div>
                <span className="text-xs text-[#A7A29B] block mb-1">Personal Bio</span>
                <p className="text-xs text-[#F4EFE7]/90 leading-relaxed bg-[#161616] p-4 rounded-xl border border-[#F4EFE7]/5">
                  {alumniProfile.bio}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Defaults */}
          <div className="glass-panel p-6 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#B89B5E] flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-[#B89B5E]" />
              <span>Contact Visibility Settings</span>
            </h3>
            <p className="text-xs text-[#A7A29B]">
              Control whether your contact details are visible to public directory visitors.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-[#F4EFE7]/5">
                <span>LinkedIn Link</span>
                <span className="text-green-400 font-semibold text-[11px]">Visible by default</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-[#F4EFE7]/5">
                <span>Email Address</span>
                <span className="text-[#A7A29B] font-semibold text-[11px]">Hidden by default</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">User Notifications</h3>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-colors ${
                    n.is_read
                      ? 'bg-[#161616]/40 border-[#F4EFE7]/5 text-[#A7A29B]'
                      : 'bg-[#6E1F32]/20 border-[#B89B5E]/40 text-[#F4EFE7]'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-sm text-[#F4EFE7] mb-1">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-[#A7A29B]/70 font-mono">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A7A29B]">No notifications received yet.</p>
          )}
        </div>
      )}

      {/* Tab Content 3: Career Journey */}
      {activeTab === 'career' && (
        <div className="glass-panel p-6 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Career Journey</h3>
          {experiences.length > 0 ? (
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#161616] border border-[#F4EFE7]/10 text-xs space-y-1">
                  <h4 className="font-bold text-sm text-[#F4EFE7]">{exp.designation}</h4>
                  <p className="text-[#B89B5E]">{exp.company_name}</p>
                  <p className="text-[#A7A29B] text-[11px]">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A7A29B]">No career experiences listed yet.</p>
          )}
        </div>
      )}

      {/* Tab Content 4: Achievements */}
      {activeTab === 'achievements' && (
        <div className="glass-panel p-6 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Achievements</h3>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl bg-[#161616] border border-[#B89B5E]/30 text-xs space-y-1">
                  <h4 className="font-bold text-sm text-[#F4EFE7]">{ach.title}</h4>
                  <p className="text-[#B89B5E]">{ach.organization} ({ach.year})</p>
                  <p className="text-[#A7A29B]">{ach.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A7A29B]">No achievements listed yet.</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-[#B89B5E]/30 space-y-5 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#F4EFE7]">Submit Profile Update Request</h3>
            <p className="text-xs text-[#A7A29B]">
              Changes are submitted as a request for college administration review before updating live.
            </p>

            <form onSubmit={handleSubmitProfileRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Current Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-bold shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
