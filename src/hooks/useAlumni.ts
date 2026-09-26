import { useState, useEffect } from 'react';
import { alumniService, DirectoryFilters } from '../services/alumniService';
import { AlumniProfile, Department, Company, Industry } from '../types/database';

export function useAlumni(initialFilters?: DirectoryFilters) {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DirectoryFilters>(initialFilters || {});

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptList, compList, indList, alumniList] = await Promise.all([
        alumniService.getDepartments(),
        alumniService.getCompanies(),
        alumniService.getIndustries(),
        alumniService.getPublicAlumniProfiles(filters),
      ]);
      setDepartments(deptList);
      setCompanies(compList);
      setIndustries(indList);
      setAlumni(alumniList);
    } catch (err) {
      console.error('Error loading alumni directory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.search, filters.department_id, filters.batch, filters.company_id, filters.industry_id]);

  return {
    alumni,
    departments,
    companies,
    industries,
    loading,
    filters,
    setFilters,
    refetch: loadData,
  };
}
