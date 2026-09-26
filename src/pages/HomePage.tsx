import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alumniService } from '../services/alumniService';
import { AlumniProfile } from '../types/database';
import { AlumniCard } from '../components/AlumniCard';
import { AlumniDetailModal } from '../components/AlumniDetailModal';
import { ShieldCheck, Users, Building2, Award, Search, ArrowRight, GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [distinguished, setDistinguished] = useState<AlumniProfile[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    alumniService.getDistinguishedAlumni().then(setDistinguished);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 overflow-hidden border-b border-[#F4EFE7]/10 bg-gradient-to-b from-[#3A111C]/40 via-[#0D0D0D] to-[#0D0D0D]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6E1F32]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1E1A1B] border border-[#B89B5E]/40 text-xs text-[#B89B5E] shadow-md">
            <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
            <span>Annai Mira College of Engineering & Technology (TNEA: 1137)</span>
          </div>

          <h1 className="font-serif font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F4EFE7] tracking-tight leading-tight max-w-4xl mx-auto">
            Connecting Our Past, <br />
            <span className="gold-gradient-text">Inspiring Our Future</span>
          </h1>

          <p className="text-base sm:text-lg text-[#A7A29B] max-w-2xl mx-auto leading-relaxed">
            The official digital alumni ecosystem of Annai Mira College of Engineering & Technology, Vellore. Search verified graduates, discover professional journeys, and connect across global technology leaders.
          </p>

          {/* Quick Directory Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative group">
            <div className="glass-panel p-2 rounded-2xl flex items-center shadow-2xl border border-[#B89B5E]/40 focus-within:border-[#B89B5E] transition-all">
              <Search className="w-5 h-5 text-[#B89B5E] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by name, company (e.g. Zoho, TCS), designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-[#F4EFE7] placeholder-[#A7A29B]/50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl burgundy-gradient-btn text-white text-sm font-semibold flex items-center space-x-1.5 shrink-0 shadow-md"
              >
                <span>Search Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#F4EFE7]/10">
            <div className="p-4 rounded-xl bg-[#161616]/60 border border-[#F4EFE7]/5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B89B5E] block">6+</span>
              <span className="text-xs text-[#A7A29B]">Departments (CSE, ECE, EEE, MECH, CIVIL, IT)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161616]/60 border border-[#F4EFE7]/5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B89B5E] block">1,000+</span>
              <span className="text-xs text-[#A7A29B]">Verified AMCET Graduates</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161616]/60 border border-[#F4EFE7]/5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B89B5E] block">150+</span>
              <span className="text-xs text-[#A7A29B]">Global Corporate Employers</span>
            </div>
            <div className="p-4 rounded-xl bg-[#161616]/60 border border-[#F4EFE7]/5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B89B5E] block">100%</span>
              <span className="text-xs text-[#A7A29B]">Master Register Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* College Identity & Campus Image Overview */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#B89B5E]/30 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Campus Image */}
            <div className="relative rounded-2xl overflow-hidden border border-[#B89B5E]/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000"
                alt="Annai Mira College of Engineering & Technology Campus"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0D0D0D]/80 backdrop-blur-md border border-[#F4EFE7]/10 flex items-center space-x-3">
                <img src="/amcet-logo.png" alt="AMCET Emblem" className="w-10 h-10 object-contain rounded-full bg-[#161616] p-1 border border-[#B89B5E]/40" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#F4EFE7]">Annai Mira College Campus</h4>
                  <p className="text-[11px] text-[#A7A29B]">Arappakkam, Vellore, Tamil Nadu - 632517</p>
                </div>
              </div>
            </div>

            {/* Details & Department Badges */}
            <div className="space-y-5">
              <span className="text-xs text-[#B89B5E] uppercase tracking-widest font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />
                <span>NAAC Accredited & Anna University Affiliated</span>
              </span>

              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F4EFE7] leading-tight">
                Annai Mira College of Engineering & Technology
              </h2>

              <p className="text-sm text-[#A7A29B] leading-relaxed">
                AMCET is dedicated to developing skilled engineers, innovative technologists, and visionary leaders. Our alumni network connects graduates from all engineering disciplines to build mentorship opportunities and continuous collegiate collaboration.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[#F4EFE7] block">Engineering Departments:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of CSE</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of ECE</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of EEE</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of MECH</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of CIVIL</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#161616] text-xs text-[#F4EFE7] border border-[#B89B5E]/30 font-medium">Department of IT</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F4EFE7]/10 flex items-center justify-between text-xs text-[#A7A29B]">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-[#B89B5E]" />
                  <span>NH-46, Arappakkam, Vellore</span>
                </div>
                <span className="text-[#B89B5E] font-mono font-bold">TNEA Code: 1137</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinguished Alumni Showcase */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#F4EFE7]/10 pb-4">
          <div>
            <span className="text-xs text-[#B89B5E] uppercase tracking-widest font-semibold flex items-center space-x-1">
              <Award className="w-4 h-4 text-[#B89B5E]" />
              <span>Alumni Honors</span>
            </span>
            <h2 className="font-serif font-bold text-3xl text-[#F4EFE7] mt-1">Distinguished Alumni Spotlight</h2>
          </div>
          <Link to="/distinguished" className="text-xs font-semibold text-[#B89B5E] hover:underline flex items-center space-x-1">
            <span>View All Honors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {distinguished.slice(0, 3).map((alumni) => (
            <AlumniCard key={alumni.id} alumni={alumni} onClickDetail={setSelectedAlumni} />
          ))}
        </div>
      </section>

      {/* Registration CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-[#6E1F32] via-[#3A111C] to-[#1E1A1B] p-8 sm:p-12 rounded-3xl border border-[#B89B5E]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#F4EFE7]">Are You an AMCET Graduate?</h2>
            <p className="text-sm text-[#F4EFE7]/80">
              Claim your official alumni profile using your Master Register Number and registered college email address to join the verified network.
            </p>
          </div>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-[#B89B5E] text-[#0D0D0D] font-bold text-sm hover:bg-[#d4b574] transition-all shadow-lg shrink-0"
          >
            Claim Official Profile
          </Link>
        </div>
      </section>

      {/* Alumni Detail Modal */}
      <AlumniDetailModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
    </div>
  );
};
