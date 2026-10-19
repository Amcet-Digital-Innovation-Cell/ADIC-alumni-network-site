import React, { useState, useEffect } from 'react';
import { AlumniProfile, CareerExperience, Achievement } from '../types/database';
import { alumniService } from '../services/alumniService';
import { X, Building2, MapPin, GraduationCap, Linkedin, Mail, Calendar, Award, Briefcase, CheckCircle2 } from 'lucide-react';

interface AlumniDetailModalProps {
  alumni: AlumniProfile | null;
  onClose: () => void;
}

export const AlumniDetailModal: React.FC<AlumniDetailModalProps> = ({ alumni, onClose }) => {
  const [experiences, setExperiences] = useState<CareerExperience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alumni?.id) {
      setLoading(true);
      Promise.all([
        alumniService.getCareerExperiences(alumni.id),
        alumniService.getAchievements(alumni.id),
      ]).then(([expList, achList]) => {
        setExperiences(expList);
        setAchievements(achList);
        setLoading(false);
      });
    }
  }, [alumni?.id]);

  if (!alumni) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl overflow-hidden shadow-2xl border border-[#B89B5E]/30 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0D0D0D]/60 text-[#F4EFE7] hover:bg-[#6E1F32] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-[#3A111C] via-[#6E1F32] to-[#123047] p-6 flex items-end">
          {alumni.is_distinguished && (
            <span className="px-3 py-1 rounded-full bg-[#B89B5E] text-[#0D0D0D] font-bold text-xs uppercase tracking-wider flex items-center space-x-1 shadow">
              <Award className="w-3.5 h-3.5" />
              <span>Distinguished Alumni</span>
            </span>
          )}
        </div>

        {/* Profile Info Header */}
        <div className="px-6 pb-6 relative pt-0 -mt-16 border-b border-[#F4EFE7]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={
                    alumni.photo_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=6e1f32&color=f4efe7&bold=true`
                  }
                  alt={alumni.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#0D0D0D] bg-[#161616] shadow-xl"
                />
                <CheckCircle2 className="w-6 h-6 text-[#B89B5E] bg-[#0D0D0D] rounded-full absolute bottom-1 right-1" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#F4EFE7]">{alumni.name}</h2>
                <p className="text-sm font-semibold text-[#B89B5E]">{alumni.current_designation || 'Alumni'}</p>
                <p className="text-xs text-[#A7A29B] flex items-center space-x-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#B89B5E]" />
                  <span>{alumni.company?.name || alumni.current_company || 'AMCET Alumni'}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              {alumni.show_linkedin && alumni.linkedin_url && (
                <a
                  href={alumni.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-md bg-[#0077B6]/20 text-[#0077B6] border border-[#0077B6]/40 hover:bg-[#0077B6] hover:text-white transition-all text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {alumni.show_email && alumni.email && (
                <a
                  href={`mailto:${alumni.email}`}
                  className="px-3.5 py-1.5 rounded-md bg-[#6E1F32]/30 text-[#F4EFE7] border border-[#6E1F32] hover:bg-[#6E1F32] transition-all text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#161616] p-4 rounded-xl border border-[#F4EFE7]/10">
            <div>
              <span className="text-[#A7A29B]/70 block">Department</span>
              <span className="font-semibold text-[#F4EFE7]">{alumni.department?.name || alumni.department_id || 'Engineering'}</span>
            </div>
            <div>
              <span className="text-[#A7A29B]/70 block">Batch / Graduation</span>
              <span className="font-semibold text-[#B89B5E] font-mono">{alumni.batch} (Graduated {alumni.graduation_year})</span>
            </div>
            <div>
              <span className="text-[#A7A29B]/70 block">Location</span>
              <span className="font-semibold text-[#F4EFE7]">{alumni.location || 'N/A'}</span>
            </div>
          </div>

          {/* Bio */}
          {alumni.bio && (
            <div>
              <h3 className="font-serif font-semibold text-sm text-[#B89B5E] uppercase tracking-wider mb-2">About Alumni</h3>
              <p className="text-sm text-[#F4EFE7]/90 leading-relaxed bg-[#161616]/40 p-4 rounded-xl border border-[#F4EFE7]/5">
                {alumni.bio}
              </p>
            </div>
          )}

          {/* Career Journey */}
          <div>
            <h3 className="font-serif font-semibold text-sm text-[#B89B5E] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Career Journey</span>
            </h3>
            {experiences.length > 0 ? (
              <div className="space-y-3 relative border-l-2 border-[#6E1F32] ml-2 pl-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    <div className="w-3 h-3 rounded-full bg-[#B89B5E] absolute -left-[23px] top-1 border-2 border-[#0D0D0D]" />
                    <div className="bg-[#161616]/80 p-3.5 rounded-xl border border-[#F4EFE7]/5">
                      <h4 className="font-semibold text-sm text-[#F4EFE7]">{exp.designation}</h4>
                      <p className="text-xs text-[#B89B5E]">{exp.company_name}</p>
                      <p className="text-[11px] text-[#A7A29B] mt-0.5">
                        {exp.start_date ? new Date(exp.start_date).getFullYear() : ''} - {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                      </p>
                      {exp.description && <p className="text-xs text-[#A7A29B]/80 mt-1.5">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A7A29B] italic">No prior career entries listed.</p>
            )}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h3 className="font-serif font-semibold text-sm text-[#B89B5E] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Key Achievements</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="bg-[#161616] p-3.5 rounded-xl border border-[#B89B5E]/20">
                    <h4 className="font-semibold text-xs text-[#F4EFE7]">{ach.title}</h4>
                    <p className="text-[11px] text-[#B89B5E]">{ach.organization} {ach.year && `(${ach.year})`}</p>
                    {ach.description && <p className="text-xs text-[#A7A29B]/80 mt-1">{ach.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
