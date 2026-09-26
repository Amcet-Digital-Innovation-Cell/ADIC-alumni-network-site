import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#F4EFE7]/10 pt-16 pb-12 px-4 lg:px-8 text-[#A7A29B]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6E1F32] to-[#B89B5E] p-0.5">
              <div className="w-full h-full bg-[#0D0D0D] rounded-full flex items-center justify-center">
                <span className="font-serif font-bold text-[#B89B5E] text-xs">AMC</span>
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#F4EFE7] text-lg">AMCET Alumni Network</h3>
              <p className="text-xs text-[#B89B5E]">Annai Mira College of Engineering & Technology</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-md text-[#A7A29B]/80">
            A centralized digital alumni ecosystem connecting AMCET, verified alumni, and current students. Digitally preserving institutional excellence, career mentorship, and global alumni leadership.
          </p>
          <div className="flex items-center space-x-4 pt-2 text-xs text-[#A7A29B]/70">
            <span className="flex items-center space-x-1"><ShieldCheck className="w-4 h-4 text-[#B89B5E]" /> <span>NAAC Accredited</span></span>
            <span>•</span>
            <span>Anna University Affiliated</span>
            <span>•</span>
            <span>TNEA Code: 1137</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-semibold text-[#F4EFE7] mb-4 text-sm tracking-wider uppercase">Platform Navigation</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-[#B89B5E] transition-colors">Home Page</Link></li>
            <li><Link to="/directory" className="hover:text-[#B89B5E] transition-colors">Alumni Directory</Link></li>
            <li><Link to="/distinguished" className="hover:text-[#B89B5E] transition-colors">Distinguished Alumni</Link></li>
            <li><Link to="/register" className="hover:text-[#B89B5E] transition-colors">Register / Claim Record</Link></li>
            <li><Link to="/login" className="hover:text-[#B89B5E] transition-colors">Alumni Sign In</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif font-semibold text-[#F4EFE7] mb-4 text-sm tracking-wider uppercase">Placement Cell</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#B89B5E] mt-0.5 shrink-0" />
              <span>NH-46, Chennai-Bengaluru National Highway, Arappakkam, Vellore, Tamil Nadu - 632517</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#B89B5E] shrink-0" />
              <a href="mailto:alumni@amcet.in" className="hover:text-[#B89B5E] transition-colors">alumni@amcet.in</a>
            </li>
            <li className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#B89B5E] shrink-0" />
              <a href="https://amcet.in" target="_blank" rel="noreferrer" className="hover:text-[#B89B5E] transition-colors flex items-center space-x-1">
                <span>amcet.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#F4EFE7]/5 flex flex-col md:flex-row items-center justify-between text-xs text-[#A7A29B]/60">
        <p>© {new Date().getFullYear()} Annai Mira College of Engineering & Technology. All rights reserved.</p>
        <p className="mt-2 md:mt-0">ADIC — Digital Innovation Cell</p>
      </div>
    </footer>
  );
};
