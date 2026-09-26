import React from 'react';
import { AlumniProfile } from '../types/database';
import { Building2, MapPin, GraduationCap, Linkedin, Mail, Award, CheckCircle2 } from 'lucide-react';

interface AlumniCardProps {
  alumni: AlumniProfile;
  onClickDetail?: (alumni: AlumniProfile) => void;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, onClickDetail }) => {
  return (
    <div className="glass-panel rounded-xl overflow-hidden hover:border-[#B89B5E]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg">
      {/* Top Banner & Photo */}
      <div>
        <div className="h-24 bg-gradient-to-r from-[#3A111C] via-[#6E1F32] to-[#1E1A1B] relative p-3">
          {alumni.is_distinguished && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#B89B5E] text-[#0D0D0D] font-bold text-[10px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
              <Award className="w-3 h-3" />
              <span>Distinguished</span>
            </span>
          )}
        </div>

        <div className="px-5 pt-0 -mt-12 flex items-end justify-between">
          <div className="relative">
            <img
              src={
                alumni.photo_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=6e1f32&color=f4efe7&bold=true`
              }
              alt={alumni.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#0D0D0D] shadow-md bg-[#161616]"
            />
            <div title="Verified Alumni" className="absolute bottom-0 right-0">
              <CheckCircle2 className="w-5 h-5 text-[#B89B5E] bg-[#0D0D0D] rounded-full" />
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-[#161616] text-[#B89B5E] border border-[#B89B5E]/20 font-mono font-medium">
            {alumni.batch || `${alumni.graduation_year || ''}`}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <div>
            <h3 
              onClick={() => onClickDetail && onClickDetail(alumni)}
              className="font-serif font-bold text-lg text-[#F4EFE7] group-hover:text-[#B89B5E] transition-colors cursor-pointer"
            >
              {alumni.name}
            </h3>
            <p className="text-xs text-[#B89B5E] font-medium mt-0.5">
              {alumni.current_designation || 'Alumni'}
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-[#A7A29B]">
            <div className="flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5 text-[#B89B5E]/80 shrink-0" />
              <span className="truncate">{alumni.company?.name || alumni.current_company || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#B89B5E]/80 shrink-0" />
              <span className="truncate">{alumni.department?.name || alumni.department_id || 'AMCET Alumni'}</span>
            </div>
            {alumni.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#B89B5E]/80 shrink-0" />
                <span className="truncate">{alumni.location}</span>
              </div>
            )}
          </div>

          {alumni.bio && (
            <p className="text-xs text-[#A7A29B]/80 line-clamp-2 italic pt-1 border-t border-[#F4EFE7]/5">
              "{alumni.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Footer Links & Actions */}
      <div className="p-4 bg-[#161616]/60 border-t border-[#F4EFE7]/10 flex items-center justify-between">
        <button
          onClick={() => onClickDetail && onClickDetail(alumni)}
          className="text-xs text-[#B89B5E] font-semibold hover:underline"
        >
          View Profile & Journey
        </button>

        <div className="flex items-center space-x-2">
          {alumni.show_linkedin && alumni.linkedin_url && (
            <a
              href={alumni.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded bg-[#0077B6]/20 text-[#0077B6] hover:bg-[#0077B6]/40 transition-colors"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {alumni.show_email && alumni.email && (
            <a
              href={`mailto:${alumni.email}`}
              className="p-1.5 rounded bg-[#6E1F32]/30 text-[#F4EFE7] hover:bg-[#6E1F32]/50 transition-colors"
              title="Contact Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
