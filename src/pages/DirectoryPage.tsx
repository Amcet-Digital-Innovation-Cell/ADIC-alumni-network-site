import React, { useState } from 'react';
import { useAlumni } from '../hooks/useAlumni';
import { AlumniCard } from '../components/AlumniCard';
import { AlumniDetailModal } from '../components/AlumniDetailModal';
import { AlumniProfile } from '../types/database';
import { Search, Filter, RefreshCw, Users } from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { alumni, departments, companies, industries, loading, filters, setFilters, refetch } = useAlumni();
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  // Extract unique batches for batch filter dropdown
  const availableBatches = Array.from(
    new Set(['2021-2025', '2020-2024', '2019-2023', '2018-2022', ...alumni.map((a) => a.batch).filter(Boolean)])
  );

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E1A1B] border border-[#B89B5E]/30 text-xs text-[#B89B5E]">
          <Users className="w-4 h-4 text-[#B89B5E]" />
          <span>Public Alumni Database</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#F4EFE7]">Alumni Directory</h1>
        <p className="text-sm text-[#A7A29B] max-w-2xl">
          Search and connect with verified graduates of Annai Mira College of Engineering & Technology across departments, batches, and companies.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-[#B89B5E] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, title, or company..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-[#161616] pl-9 pr-3 py-2 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/50 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filters.department_id || ''}
              onChange={(e) => setFilters({ ...filters, department_id: e.target.value || undefined })}
              className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <select
              value={filters.batch || ''}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value || undefined })}
              className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
            >
              <option value="">All Batches</option>
              {availableBatches.map((batch) => (
                <option key={batch as string} value={batch as string}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={filters.company_id || ''}
              onChange={(e) => setFilters({ ...filters, company_id: e.target.value || undefined })}
              className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
            >
              <option value="">All Companies</option>
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center justify-between text-xs text-[#A7A29B] pt-2 border-t border-[#F4EFE7]/5">
          <span>Showing <strong className="text-[#B89B5E] font-bold">{alumni.length}</strong> verified alumni</span>

          {(filters.search || filters.department_id || filters.batch || filters.company_id) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#B89B5E] hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#A7A29B]">
          <RefreshCw className="w-8 h-8 text-[#B89B5E] animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading AMCET alumni directory...</p>
        </div>
      ) : alumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((item) => (
            <AlumniCard key={item.id} alumni={item} onClickDetail={setSelectedAlumni} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center glass-panel rounded-2xl border border-[#F4EFE7]/10 space-y-3">
          <Filter className="w-10 h-10 text-[#B89B5E]/50 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">No Alumni Records Found</h3>
          <p className="text-xs text-[#A7A29B] max-w-sm mx-auto">
            Try adjusting your search criteria or selecting a different department/batch.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-[#161616] text-[#B89B5E] border border-[#B89B5E]/30 text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AlumniDetailModal alumni={selectedAlumni} onClose={() => setSelectedAlumni(null)} />
    </div>
  );
};
