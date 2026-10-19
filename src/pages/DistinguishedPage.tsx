import React, { useState, useEffect } from 'react';
import { alumniService } from '../services/alumniService';
import { AlumniProfile } from '../types/database';
import { AlumniCard } from '../components/AlumniCard';
import { AlumniDetailModal } from '../components/AlumniDetailModal';
import { Award, ShieldCheck } from 'lucide-react';

export const DistinguishedPage: React.FC = () => {
  const [distinguished, setDistinguished] = useState<AlumniProfile[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    alumniService.getDistinguishedAlumni().then((list) => {
      setDistinguished(list);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E1A1B] border border-[#B89B5E]/30 text-xs text-[#B89B5E]">
          <Award className="w-4 h-4 text-[#B89B5E]" />
          <span>Alumni Honors</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#F4EFE7]">Distinguished Alumni Showcase</h1>
        <p className="text-sm text-[#A7A29B] max-w-2xl">
          Celebrating outstanding professional achievements, corporate leadership, and continuous contributions of Annai Mira College of Engineering & Technology graduates.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#A7A29B]">Loading distinguished alumni...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {distinguished.map((alumni) => (
            <AlumniCard key={alumni.id} alumni={alumni} onClickDetail={setSelectedAlumni} />
          ))}
        </div>
      )}

      <AlumniDetailModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
    </div>
  );
};
