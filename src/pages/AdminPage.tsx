import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { profileRequestService } from '../services/profileRequestService';
import { alumniService, SAMPLE_DEPARTMENTS, SAMPLE_COMPANIES, SAMPLE_INDUSTRIES } from '../services/alumniService';
import { ProfileUpdateRequest, AlumniProfile, Department, Company, Industry, AlumniMaster, UserProfile, CareerExperience, Achievement } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, Users, Building2, Layers, 
  RefreshCw, Search, Plus, Award, Eye, EyeOff, FileText, CheckSquare, XSquare, AlertCircle, UserCheck,
  Briefcase, Trash2, Calendar, Edit, ArrowRight
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'master' | 'alumni' | 'departments' | 'companies' | 'add_alumni'>('requests');
  
  const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<UserProfile[]>([]);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [masterRecords, setMasterRecords] = useState<AlumniMaster[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Search & Filter state for Admin tabs
  const [masterSearch, setMasterSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');

  // Profile update rejection modal
  const [selectedReq, setSelectedReq] = useState<ProfileUpdateRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Account Registration Approval modal
  const [selectedRegUser, setSelectedRegUser] = useState<any | null>(null);
  const [showApproveRegModal, setShowApproveRegModal] = useState(false);
  const [isDistinguishedInput, setIsDistinguishedInput] = useState(false);

  // Account Registration Rejection modal
  const [selectedRegUserReject, setSelectedRegUserReject] = useState<any | null>(null);
  const [showRejectRegModal, setShowRejectRegModal] = useState(false);
  const [regRejectionReason, setRegRejectionReason] = useState('');

  // Add Department Form modal
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  // Add Company Form modal
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompWebsite, setNewCompWebsite] = useState('');
  const [newCompIndustryId, setNewCompIndustryId] = useState('');

  // Add Alumni Form state (Section 1)
  const [newAlumniRegNo, setNewAlumniRegNo] = useState('');
  const [newAlumniName, setNewAlumniName] = useState('');
  const [newAlumniEmail, setNewAlumniEmail] = useState('');
  const [newAlumniBatch, setNewAlumniBatch] = useState('');
  const [newAlumniYear, setNewAlumniYear] = useState('');

  // Add Alumni Career Journey state (Section 2)
  const [selectedJourneyAlumniId, setSelectedJourneyAlumniId] = useState<string>('44444444-4444-4444-4444-444444444403');
  const [journeyExperiences, setJourneyExperiences] = useState<CareerExperience[]>([
    {
      id: 'exp-1',
      alumni_id: '44444444-4444-4444-4444-444444444403',
      designation: 'Software Engineer',
      company_name: 'Zoho Corporation',
      start_date: '2025-06-01',
      is_current: true,
      description: 'Building cloud infrastructure and microservices.',
    },
    {
      id: 'exp-2',
      alumni_id: '44444444-4444-4444-4444-444444444403',
      designation: 'Software Engineering Intern',
      company_name: 'TCS',
      start_date: '2024-05-01',
      end_date: '2024-11-30',
      is_current: false,
      description: 'Assisted in web development and API integration.',
    },
  ]);
  const [journeyAchievements, setJourneyAchievements] = useState<Achievement[]>([
    {
      id: 'ach-1',
      alumni_id: '44444444-4444-4444-4444-444444444403',
      title: 'Best Outstanding Student Award',
      organization: 'AMCET College Day 2025',
      year: 2025,
      description: 'Awarded for academic excellence and leadership in technical symposiums.',
    },
  ]);

  // Form states for new experience entry
  const [newExpDesignation, setNewExpDesignation] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpStartDate, setNewExpStartDate] = useState('');
  const [newExpEndDate, setNewExpEndDate] = useState('');
  const [newExpIsCurrent, setNewExpIsCurrent] = useState(false);
  const [newExpDescription, setNewExpDescription] = useState('');

  // Form states for new achievement entry
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchOrg, setNewAchOrg] = useState('');
  const [newAchYear, setNewAchYear] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');

  // Edit Alumni Profile Modal & Request States
  const [showEditAlumniModal, setShowEditAlumniModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBatch, setEditBatch] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDepartmentId, setEditDepartmentId] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [editIsDistinguished, setEditIsDistinguished] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [reqs, pendingRegs, alumni, depts, comps, inds] = await Promise.all([
        profileRequestService.getPendingRequests(),
        authService.getPendingRegistrations(),
        alumniService.getAllAlumniProfiles(),
        alumniService.getDepartments(),
        alumniService.getCompanies(),
        alumniService.getIndustries(),
      ]);
      setRequests(reqs);
      setPendingRegistrations(pendingRegs);
      setAlumniList(alumni);
      setDepartments(depts);
      setCompanies(comps);
      setIndustries(inds);

      let loadedMasters: AlumniMaster[] = [];
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('alumni_master').select('*').order('register_number');
          if (!error && data && data.length > 0) {
            loadedMasters = data as AlumniMaster[];
          }
        } catch (e) {
          console.warn('Supabase fetch failed for alumni_master:', e);
        }
      }

      if (loadedMasters.length === 0) {
        try {
          const stored = localStorage.getItem('amcet_master_records');
          if (stored) {
            loadedMasters = JSON.parse(stored);
          }
        } catch (e) {}

        if (!loadedMasters || loadedMasters.length === 0) {
          loadedMasters = [
            { register_number: 'AMC21CSE001', name: 'Arun Kumar', registered_email: 'arun.sample@amcet.edu', batch: '2021-2025', graduation_year: 2025, is_claimed: true },
            { register_number: 'AMC21CSE002', name: 'Priya Sharma', registered_email: 'priya.sample@amcet.edu', batch: '2021-2025', graduation_year: 2025, is_claimed: false },
            { register_number: 'AMC20ECE015', name: 'Rahul Kumar', registered_email: 'rahul.sample@amcet.edu', batch: '2020-2024', graduation_year: 2024, is_claimed: false },
            { register_number: 'AMC19IT008', name: 'Meena Raj', registered_email: 'meena.sample@amcet.edu', batch: '2019-2023', graduation_year: 2023, is_claimed: false },
          ];
          try {
            localStorage.setItem('amcet_master_records', JSON.stringify(loadedMasters));
          } catch (e) {}
        }
      }
      setMasterRecords(loadedMasters);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegUser) return;
    setActionMsg(null);
    try {
      await authService.processRegistration(
        selectedRegUser.id,
        'approved',
        undefined,
        undefined,
        isDistinguishedInput
      );
      setActionMsg(`Account for "${selectedRegUser.email}" approved and activated successfully!`);
      setShowApproveRegModal(false);
      setSelectedRegUser(null);
      setIsDistinguishedInput(false);
      loadAdminData();
    } catch (err: any) {
      setActionMsg(err.message || 'Error approving registration.');
    }
  };

  const handleRejectRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegUserReject) return;
    setActionMsg(null);
    try {
      await authService.processRegistration(
        selectedRegUserReject.id,
        'rejected',
        regRejectionReason || 'Application details could not be verified by Admin.'
      );
      setActionMsg(`Registration for "${selectedRegUserReject.email}" rejected.`);
      setShowRejectRegModal(false);
      setSelectedRegUserReject(null);
      setRegRejectionReason('');
      loadAdminData();
    } catch (err: any) {
      setActionMsg(err.message || 'Error rejecting registration.');
    }
  };

  const handleApprove = async (reqId: string) => {
    setActionMsg(null);
    try {
      await profileRequestService.processRequest(reqId, 'approved');
      setActionMsg('Profile update request approved successfully!');
      loadAdminData();
    } catch (err: any) {
      setActionMsg(err.message || 'Error approving request.');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    setActionMsg(null);
    try {
      await profileRequestService.processRequest(selectedReq.id, 'rejected', rejectionReason);
      setActionMsg('Profile update request rejected.');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedReq(null);
      loadAdminData();
    } catch (err: any) {
      setActionMsg(err.message || 'Error rejecting request.');
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('departments').insert({
        name: newDeptName,
        code: newDeptCode.toUpperCase(),
      });
      if (error) {
        setActionMsg('Failed to add department: ' + error.message);
        return;
      }
    } else {
      setDepartments((prev) => [
        ...prev,
        { id: 'dept-' + Date.now(), name: newDeptName, code: newDeptCode.toUpperCase(), is_active: true },
      ]);
    }

    setActionMsg(`Department "${newDeptName} (${newDeptCode.toUpperCase()})" added successfully!`);
    setNewDeptName('');
    setNewDeptCode('');
    setShowAddDeptModal(false);
    loadAdminData();
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName) return;

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('companies').insert({
        name: newCompName,
        website: newCompWebsite || null,
        industry_id: newCompIndustryId || null,
      });
      if (error) {
        setActionMsg('Failed to add company: ' + error.message);
        return;
      }
    } else {
      setCompanies((prev) => [
        ...prev,
        { id: 'comp-' + Date.now(), name: newCompName, website: newCompWebsite, industry_id: newCompIndustryId },
      ]);
    }

    setActionMsg(`Company "${newCompName}" added successfully!`);
    setNewCompName('');
    setNewCompWebsite('');
    setNewCompIndustryId('');
    setShowAddCompanyModal(false);
    loadAdminData();
  };

  const handleAddAlumniMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumniRegNo || !newAlumniName || !newAlumniEmail) return;

    const newRecord: AlumniMaster = {
      register_number: newAlumniRegNo.trim().toUpperCase(),
      name: newAlumniName.trim(),
      registered_email: newAlumniEmail.trim().toLowerCase(),
      batch: newAlumniBatch.trim() || undefined,
      graduation_year: newAlumniYear ? parseInt(newAlumniYear, 10) : undefined,
      is_claimed: false,
    };

    // 1. Try Supabase if configured, but catch any error and gracefully fallback to local storage
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('alumni_master').insert({
          register_number: newRecord.register_number,
          name: newRecord.name,
          registered_email: newRecord.registered_email,
          batch: newRecord.batch || null,
          graduation_year: newRecord.graduation_year || null,
        });
        if (error) {
          console.warn('Supabase insert note:', error);
        }
      } catch (err: any) {
        console.warn('Supabase insert network error, fallback to local storage:', err);
      }
    }

    // 2. Persist master record to local storage & state so it immediately works smoothly!
    const currentMasters = masterRecords.filter(m => m.register_number !== newRecord.register_number);
    const updatedMasters = [newRecord, ...currentMasters];
    setMasterRecords(updatedMasters);
    try {
      localStorage.setItem('amcet_master_records', JSON.stringify(updatedMasters));
    } catch (e) {}

    // 3. ALSO SEND THE ADMIN APPROVAL REQUEST!
    const regUpper = newRecord.register_number;
    const dept = departments.find(d => regUpper.includes(d.code)) || departments[0] || { id: 'dept-cse', name: 'Computer Science & Engineering', code: 'CSE' };
    const newPendingUserId = 'user-pending-' + Date.now();
    const newPendingAlumniId = 'alumni-pending-' + Date.now();

    const pendingRequestObj = {
      id: newPendingUserId,
      email: newRecord.registered_email,
      role: 'alumni' as const,
      register_number: newRecord.register_number,
      registration_status: 'pending' as const,
      is_verified: false,
      created_at: new Date().toISOString(),
      alumni: {
        id: newPendingAlumniId,
        name: newRecord.name,
        register_number: newRecord.register_number,
        batch: newRecord.batch || '2021-2025',
        graduation_year: newRecord.graduation_year || 2025,
        email: newRecord.registered_email,
        department: dept,
        department_id: dept.id,
        current_designation: journeyExperiences[0]?.designation || 'Graduate Engineer',
        current_company: journeyExperiences[0]?.company_name || 'AMCET Alumni',
        bio: `Alumni graduate (${newRecord.batch || '2021-2025'}) of Annai Mira College of Engineering & Technology.`,
        is_public: true,
        is_distinguished: false,
      }
    };

    // Save pending registration
    await authService.addPendingRegistration(pendingRequestObj);
    setPendingRegistrations(prev => [pendingRequestObj, ...prev.filter(p => p.id !== pendingRequestObj.id)]);

    // Save career journey milestones & achievements if configured in Section 2
    if (journeyExperiences.length > 0) {
      await alumniService.saveCareerExperiences(newPendingAlumniId, journeyExperiences);
    }
    if (journeyAchievements.length > 0) {
      await alumniService.saveAchievements(newPendingAlumniId, journeyAchievements);
    }

    setActionMsg(`Alumni "${newAlumniName}" added! Master verification record created and Admin Approval Request has been sent.`);
    setNewAlumniRegNo('');
    setNewAlumniName('');
    setNewAlumniEmail('');
    setNewAlumniBatch('');
    setNewAlumniYear('');
    loadAdminData();
  };

  // Section 2: Sync journey & achievements when target alumni changes
  useEffect(() => {
    if (selectedJourneyAlumniId) {
      alumniService.getCareerExperiences(selectedJourneyAlumniId).then(setJourneyExperiences);
      alumniService.getAchievements(selectedJourneyAlumniId).then(setJourneyAchievements);
    }
  }, [selectedJourneyAlumniId]);

  const handleAddJourneyExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesignation.trim() || !newExpCompany.trim()) return;

    const newExp: CareerExperience = {
      id: 'exp-' + Date.now(),
      alumni_id: selectedJourneyAlumniId,
      designation: newExpDesignation.trim(),
      company_name: newExpCompany.trim(),
      start_date: newExpStartDate || null,
      end_date: newExpIsCurrent ? null : (newExpEndDate || null),
      is_current: newExpIsCurrent,
      description: newExpDescription.trim() || null,
    };

    const updated = [newExp, ...journeyExperiences];
    setJourneyExperiences(updated);
    await alumniService.saveCareerExperiences(selectedJourneyAlumniId, updated);
    setActionMsg(`Career milestone "${newExp.designation} at ${newExp.company_name}" added to timeline!`);
    setNewExpDesignation('');
    setNewExpCompany('');
    setNewExpStartDate('');
    setNewExpEndDate('');
    setNewExpIsCurrent(false);
    setNewExpDescription('');
  };

  const handleRemoveJourneyExperience = async (expId: string) => {
    const updated = journeyExperiences.filter((item) => item.id !== expId);
    setJourneyExperiences(updated);
    await alumniService.saveCareerExperiences(selectedJourneyAlumniId, updated);
    setActionMsg('Career experience entry removed.');
  };

  const handleAddJourneyAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;

    const newAch: Achievement = {
      id: 'ach-' + Date.now(),
      alumni_id: selectedJourneyAlumniId,
      title: newAchTitle.trim(),
      organization: newAchOrg.trim() || null,
      year: newAchYear ? parseInt(newAchYear, 10) : null,
      description: newAchDesc.trim() || null,
    };

    const updated = [newAch, ...journeyAchievements];
    setJourneyAchievements(updated);
    await alumniService.saveAchievements(selectedJourneyAlumniId, updated);
    setActionMsg(`Key Achievement "${newAch.title}" recorded!`);
    setNewAchTitle('');
    setNewAchOrg('');
    setNewAchYear('');
    setNewAchDesc('');
  };

  const handleRemoveJourneyAchievement = async (achId: string) => {
    const updated = journeyAchievements.filter((item) => item.id !== achId);
    setJourneyAchievements(updated);
    await alumniService.saveAchievements(selectedJourneyAlumniId, updated);
    setActionMsg('Key Achievement entry removed.');
  };

  const handleOpenEditModal = (alumni: AlumniProfile) => {
    setEditingAlumni(alumni);
    setEditName(alumni.name || '');
    setEditDesignation(alumni.current_designation || '');
    setEditCompany(alumni.company?.name || alumni.current_company || '');
    setEditLocation(alumni.location || '');
    setEditBatch(alumni.batch || '');
    setEditYear(alumni.graduation_year ? String(alumni.graduation_year) : '');
    setEditBio(alumni.bio || '');
    setEditLinkedin(alumni.linkedin_url || '');
    setEditEmail(alumni.email || '');
    setEditDepartmentId(alumni.department_id || (departments[0]?.id ?? ''));
    setEditIsPublic(alumni.is_public !== false);
    setEditIsDistinguished(Boolean(alumni.is_distinguished));
    setShowEditAlumniModal(true);
  };

  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni) return;

    const matchedComp = companies.find(
      (c) => c.name.toLowerCase() === editCompany.trim().toLowerCase()
    );
    const matchedDept = departments.find((d) => d.id === editDepartmentId);

    const currentSnapshot: Record<string, any> = {
      name: editingAlumni.name || '',
      current_designation: editingAlumni.current_designation || '',
      current_company: editingAlumni.company?.name || editingAlumni.current_company || '',
      department_id: editingAlumni.department_id || '',
      department_name: editingAlumni.department?.name || '',
      location: editingAlumni.location || '',
      batch: editingAlumni.batch || '',
      graduation_year: editingAlumni.graduation_year || '',
      email: editingAlumni.email || '',
      linkedin_url: editingAlumni.linkedin_url || '',
      bio: editingAlumni.bio || '',
      is_public: editingAlumni.is_public !== false,
      is_distinguished: Boolean(editingAlumni.is_distinguished),
    };

    const requestedChanges: Record<string, any> = {
      name: editName.trim(),
      current_designation: editDesignation.trim(),
      current_company: editCompany.trim(),
      department_id: editDepartmentId,
      department_name: matchedDept?.name || '',
      location: editLocation.trim(),
      batch: editBatch.trim(),
      graduation_year: editYear ? parseInt(editYear, 10) : undefined,
      email: editEmail.trim(),
      linkedin_url: editLinkedin.trim(),
      bio: editBio.trim(),
      is_public: editIsPublic,
      is_distinguished: editIsDistinguished,
    };

    if (matchedComp) {
      requestedChanges.company_id = matchedComp.id;
    }

    try {
      const newReq = await profileRequestService.submitProfileUpdateRequest(
        editingAlumni.id,
        requestedChanges,
        currentSnapshot,
        editingAlumni
      );

      setRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
      setShowEditAlumniModal(false);
      setActionMsg(
        `Profile update request for "${editName}" submitted to Admin Approval queue! Review it under 'Profile Update Requests' to approve & apply.`
      );
      loadAdminData();
    } catch (err: any) {
      setActionMsg(err.message || 'Error submitting profile update request.');
    }
  };

  const handleMakeAllPublic = async () => {
    const updated = alumniList.map((item) => ({ ...item, is_public: true }));
    setAlumniList(updated);
    try {
      localStorage.setItem('amcet_alumni_profiles', JSON.stringify(updated));
    } catch (e) {}
    if (isSupabaseConfigured) {
      try {
        await supabase.from('alumni_profiles').update({ is_public: true }).neq('id', '0');
      } catch (e) {}
    }
    setActionMsg(`All ${alumniList.length} alumni profiles are now set to publicly visible in the Alumni Directory!`);
  };

  const handleToggleDistinguished = async (alumni: AlumniProfile) => {
    const updatedStatus = !alumni.is_distinguished;
    if (isSupabaseConfigured) {
      try {
        await supabase.from('alumni_profiles').update({ is_distinguished: updatedStatus }).eq('id', alumni.id);
      } catch (e) {}
    }
    setAlumniList((prev) => {
      const updated = prev.map((item) => (item.id === alumni.id ? { ...item, is_distinguished: updatedStatus } : item));
      try {
        localStorage.setItem('amcet_alumni_profiles', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActionMsg(`Distinguished status updated for ${alumni.name}.`);
  };

  const handleTogglePublicVisibility = async (alumni: AlumniProfile) => {
    const updatedStatus = !alumni.is_public;
    if (isSupabaseConfigured) {
      try {
        await supabase.from('alumni_profiles').update({ is_public: updatedStatus }).eq('id', alumni.id);
      } catch (e) {}
    }
    setAlumniList((prev) => {
      const updated = prev.map((item) => (item.id === alumni.id ? { ...item, is_public: updatedStatus } : item));
      try {
        localStorage.setItem('amcet_alumni_profiles', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActionMsg(`Public directory visibility for "${alumni.name}" set to ${updatedStatus ? 'Visible' : 'Hidden'}.`);
  };

  // Filtered lists
  const filteredMaster = masterRecords.filter(
    (m) =>
      m.register_number.toLowerCase().includes(masterSearch.toLowerCase()) ||
      m.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
      m.registered_email.toLowerCase().includes(masterSearch.toLowerCase())
  );

  const filteredAlumni = alumniList.filter(
    (a) =>
      a.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
      (a.register_number && a.register_number.toLowerCase().includes(alumniSearch.toLowerCase())) ||
      (a.current_company && a.current_company.toLowerCase().includes(alumniSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B89B5E]/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#6E1F32]/40 border border-[#B89B5E]/40 text-xs text-[#B89B5E]">
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              <span>Annai Mira College of Engineering & Technology (TNEA: 1137)</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-[#F4EFE7]">Admin Management Gateway</h1>
            <p className="text-xs text-[#A7A29B]">
              Centralized administration portal for verified alumni records, master database claims, change approvals, and college department/company data.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2 rounded-xl bg-[#161616] text-[#B89B5E] border border-[#B89B5E]/30 text-xs font-semibold hover:bg-[#1E1A1B] flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Portal</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-[#161616] border border-[#B89B5E]/40 text-xs text-[#B89B5E] flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-xs text-[#A7A29B] hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-[#F4EFE7]/10 space-y-1">
          <span className="text-[11px] text-[#A7A29B] block">Total Verified Alumni</span>
          <span className="font-serif text-2xl font-bold text-[#F4EFE7]">{alumniList.length}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#F4EFE7]/10 space-y-1">
          <span className="text-[11px] text-[#A7A29B] block">Pending Requests</span>
          <span className="font-serif text-2xl font-bold text-[#B89B5E]">{requests.length}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#F4EFE7]/10 space-y-1">
          <span className="text-[11px] text-[#A7A29B] block">Master Records</span>
          <span className="font-serif text-2xl font-bold text-[#F4EFE7]">{masterRecords.length}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#F4EFE7]/10 space-y-1">
          <span className="text-[11px] text-[#A7A29B] block">Departments</span>
          <span className="font-serif text-2xl font-bold text-[#F4EFE7]">{departments.length}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-[#F4EFE7]/10 space-y-1">
          <span className="text-[11px] text-[#A7A29B] block">Companies</span>
          <span className="font-serif text-2xl font-bold text-[#F4EFE7]">{companies.length}</span>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#F4EFE7]/10 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#B89B5E]" />
          <span>Profile Update Requests ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'master'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#B89B5E]" />
          <span>Alumni Master Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'alumni'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Users className="w-4 h-4 text-[#B89B5E]" />
          <span>Directory & Visibility</span>
        </button>

        <button
          onClick={() => setActiveTab('add_alumni')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'add_alumni'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Plus className="w-4 h-4 text-[#B89B5E]" />
          <span>Add Alumni</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'departments'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#B89B5E]" />
          <span>Departments</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'companies'
              ? 'bg-[#6E1F32] text-white border border-[#B89B5E]/40'
              : 'text-[#A7A29B] hover:text-[#F4EFE7]'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#B89B5E]" />
          <span>Companies & Industries</span>
        </button>
      </div>

      {/* Tab 1: Registration Approvals & Profile Update Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-8">
          {/* 1A. Pending Account Registration Requests */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B89B5E]/30 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#6E1F32]/40 text-[#B89B5E] text-[10px] uppercase font-bold tracking-wider mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Account Approvals Required</span>
                </div>
                <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Pending Alumni Registrations</h2>
                <p className="text-xs text-[#A7A29B]">
                  New alumni who registered accounts and are awaiting Admin Approval before accessing the dashboard.
                </p>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#B89B5E]/20 text-[#B89B5E]">
                {pendingRegistrations.length} Pending
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#A7A29B]">Loading pending registrations...</div>
            ) : pendingRegistrations.length > 0 ? (
              <div className="space-y-4">
                {pendingRegistrations.map((uReg) => (
                  <div key={uReg.id} className="bg-[#161616] p-5 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4EFE7]/5 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-base text-[#F4EFE7]">{uReg.alumni?.name || 'Alumni Candidate'}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-400 border border-yellow-500/30 uppercase font-mono font-bold">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-xs text-[#B89B5E] font-mono mt-0.5">
                          {uReg.email}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedRegUserReject(uReg);
                            setRegRejectionReason('');
                            setShowRejectRegModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-950/60 transition-colors flex items-center space-x-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedRegUser(uReg);
                            setIsDistinguishedInput(false);
                            setShowApproveRegModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-green-950/60 text-green-300 border border-green-500/40 text-xs font-bold hover:bg-green-950 transition-colors flex items-center space-x-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Review & Approve</span>
                        </button>
                      </div>
                    </div>

                    {/* Stored Registration Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#0D0D0D] p-3.5 rounded-xl border border-[#F4EFE7]/5">
                      <div>
                        <span className="text-[10px] text-[#A7A29B] block uppercase tracking-wider font-semibold">Register Number</span>
                        <span className="font-mono text-[#F4EFE7] font-semibold">{uReg.register_number || uReg.alumni?.register_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A7A29B] block uppercase tracking-wider font-semibold">Department</span>
                        <span className="text-[#F4EFE7] font-semibold">{uReg.alumni?.department?.name || uReg.alumni?.department?.code || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A7A29B] block uppercase tracking-wider font-semibold">Batch</span>
                        <span className="text-[#F4EFE7] font-semibold">{uReg.alumni?.batch || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A7A29B] block uppercase tracking-wider font-semibold">Graduation Year</span>
                        <span className="text-[#F4EFE7] font-semibold">{uReg.alumni?.graduation_year || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#A7A29B] bg-[#161616]/50 rounded-2xl">
                No pending user account registrations to review.
              </div>
            )}
          </div>

          {/* 1B. Pending Profile Update Requests */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Pending Profile Update Requests</h2>
                <p className="text-xs text-[#A7A29B]">
                  Review alumni requested changes side-by-side against current profile snapshots before approving.
                </p>
              </div>
            </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#A7A29B]">Loading review queue...</div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-[#161616] p-5 rounded-2xl border border-[#F4EFE7]/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE7]/5 pb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-[#F4EFE7]">{req.alumni?.name || 'Verified Alumni'}</h3>
                      <p className="text-xs text-[#B89B5E] font-mono">
                        Reg No: {req.alumni?.register_number || req.alumni_id}
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-[#B89B5E]/20 text-[#B89B5E] font-mono self-start sm:self-auto">
                      Submitted {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-red-500/20 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-red-500/20">
                        <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider">Current Snapshot</span>
                        <span className="text-[10px] text-[#A7A29B]">Active Directory State</span>
                      </div>
                      <div className="space-y-1.5">
                        <p><strong className="text-[#A7A29B]">Full Name:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.name || 'N/A'}</span></p>
                        <p><strong className="text-[#A7A29B]">Designation:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.current_designation || 'N/A'}</span></p>
                        <p><strong className="text-[#A7A29B]">Company:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.current_company || 'N/A'}</span></p>
                        <p><strong className="text-[#A7A29B]">Location:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.location || 'N/A'}</span></p>
                        <p><strong className="text-[#A7A29B]">Batch & Year:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.batch || 'N/A'} ({req.current_snapshot?.graduation_year || 'N/A'})</span></p>
                        <p><strong className="text-[#A7A29B]">Visibility:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.is_public ? 'Publicly Visible' : 'Hidden'}</span></p>
                        <p><strong className="text-[#A7A29B]">Distinguished:</strong> <span className="text-[#F4EFE7]">{req.current_snapshot?.is_distinguished ? 'Yes' : 'No'}</span></p>
                        <p><strong className="text-[#A7A29B]">Bio:</strong> <span className="text-[#F4EFE7] line-clamp-2">{req.current_snapshot?.bio || 'N/A'}</span></p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-green-500/30 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-green-500/20">
                        <span className="text-green-400 font-bold uppercase text-[10px] tracking-wider">Requested Changes</span>
                        <span className="text-[10px] text-[#B89B5E] font-medium">Pending Admin Review</span>
                      </div>
                      <div className="space-y-1.5">
                        <p>
                          <strong className="text-[#A7A29B]">Full Name:</strong>{' '}
                          <span className={req.requested_changes?.name !== req.current_snapshot?.name ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.name || 'N/A'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Designation:</strong>{' '}
                          <span className={req.requested_changes?.current_designation !== req.current_snapshot?.current_designation ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.current_designation || 'N/A'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Company:</strong>{' '}
                          <span className={req.requested_changes?.current_company !== req.current_snapshot?.current_company ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.current_company || 'N/A'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Location:</strong>{' '}
                          <span className={req.requested_changes?.location !== req.current_snapshot?.location ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.location || 'N/A'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Batch & Year:</strong>{' '}
                          <span className={req.requested_changes?.batch !== req.current_snapshot?.batch || req.requested_changes?.graduation_year !== req.current_snapshot?.graduation_year ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.batch || 'N/A'} ({req.requested_changes?.graduation_year || 'N/A'})
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Visibility:</strong>{' '}
                          <span className={req.requested_changes?.is_public !== req.current_snapshot?.is_public ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.is_public ? 'Publicly Visible' : 'Hidden'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Distinguished:</strong>{' '}
                          <span className={req.requested_changes?.is_distinguished !== req.current_snapshot?.is_distinguished ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded' : 'text-[#F4EFE7]'}>
                            {req.requested_changes?.is_distinguished ? 'Yes' : 'No'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#A7A29B]">Bio:</strong>{' '}
                          <span className={req.requested_changes?.bio !== req.current_snapshot?.bio ? 'text-green-300 font-semibold bg-green-950/40 px-1.5 py-0.5 rounded line-clamp-2' : 'text-[#F4EFE7] line-clamp-2'}>
                            {req.requested_changes?.bio || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedReq(req);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-950/60 transition-colors flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 rounded-xl bg-green-950/60 text-green-300 border border-green-500/40 text-xs font-bold hover:bg-green-950 transition-colors flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Apply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#A7A29B] bg-[#161616]/50 rounded-2xl">
              No pending profile update requests to review.
            </div>
          )}
        </div>
      </div>
      )}

      {/* Tab 2: Alumni Master Verification Database */}
      {activeTab === 'master' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EFE7]/10 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Alumni Master Database (`alumni_master`)</h2>
              <p className="text-xs text-[#A7A29B]">
                Official college-provided verification dataset. Strictly isolated from public access.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-[#B89B5E] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search master reg no or email..."
                value={masterSearch}
                onChange={(e) => setMasterSearch(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#B89B5E] font-semibold border-b border-[#F4EFE7]/10">
                <tr>
                  <th className="p-3">Register Number</th>
                  <th className="p-3">Graduate Name</th>
                  <th className="p-3">Registered College Email</th>
                  <th className="p-3">Batch & Year</th>
                  <th className="p-3">Claim Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE7]/5">
                {filteredMaster.map((rec) => (
                  <tr key={rec.register_number} className="hover:bg-[#161616]/50 transition-colors">
                    <td className="p-3 font-mono text-[#B89B5E] font-semibold">{rec.register_number}</td>
                    <td className="p-3 text-[#F4EFE7]">{rec.name}</td>
                    <td className="p-3 text-[#A7A29B]">{rec.registered_email}</td>
                    <td className="p-3 text-[#A7A29B] font-mono">{rec.batch || rec.graduation_year}</td>
                    <td className="p-3">
                      {rec.is_claimed ? (
                        <span className="px-2.5 py-1 rounded bg-green-950/60 text-green-300 border border-green-500/30 text-[10px] font-semibold">
                          Claimed & Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-[#161616] text-[#A7A29B] border border-[#F4EFE7]/10 text-[10px]">
                          Unclaimed Master Record
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Alumni Directory & Visibility Management */}
      {activeTab === 'alumni' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EFE7]/10 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Directory & Visibility Management</h2>
              <p className="text-xs text-[#A7A29B]">Manage public alumni profiles, edit credentials, and control directory visibility.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleMakeAllPublic}
                className="px-3.5 py-2 rounded-xl bg-green-950/60 text-green-300 border border-green-500/40 text-xs font-semibold hover:bg-green-950 flex items-center justify-center space-x-1.5 transition-colors whitespace-nowrap shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Make All Visible in Directory</span>
              </button>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-[#B89B5E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  value={alumniSearch}
                  onChange={(e) => setAlumniSearch(e.target.value)}
                  className="w-full bg-[#161616] pl-9 pr-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#B89B5E] font-semibold border-b border-[#F4EFE7]/10">
                <tr>
                  <th className="p-3">Name & Reg No</th>
                  <th className="p-3">Designation / Company</th>
                  <th className="p-3">Department & Batch</th>
                  <th className="p-3">Public Directory Status</th>
                  <th className="p-3">Distinguished Badge</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE7]/5">
                {filteredAlumni.map((a) => (
                  <tr key={a.id} className="hover:bg-[#161616]/50 transition-colors">
                    <td className="p-3">
                      <span className="font-semibold text-[#F4EFE7] block">{a.name}</span>
                      <span className="font-mono text-[#A7A29B] text-[11px]">{a.register_number}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#F4EFE7] block">{a.current_designation || 'Alumni'}</span>
                      <span className="text-[#B89B5E] text-[11px]">{a.company?.name || a.current_company}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#F4EFE7] block">{a.department?.code || 'AMCET'}</span>
                      <span className="text-[#A7A29B] text-[11px]">{a.batch || '2021-2025'}</span>
                    </td>
                    <td className="p-3">
                      {a.is_public ? (
                        <span className="px-2 py-0.5 rounded bg-green-950/60 text-green-300 border border-green-500/30 text-[10px] font-semibold">
                          Publicly Visible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/30 text-[10px] font-semibold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {a.is_distinguished ? (
                        <span className="px-2 py-0.5 rounded bg-[#B89B5E] text-[#0D0D0D] font-bold text-[10px]">
                          Distinguished
                        </span>
                      ) : (
                        <span className="text-[#A7A29B] text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(a)}
                          className="px-2.5 py-1 rounded bg-[#B89B5E]/20 text-[#B89B5E] hover:bg-[#B89B5E]/30 border border-[#B89B5E]/40 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          onClick={() => handleTogglePublicVisibility(a)}
                          className="px-2.5 py-1 rounded bg-[#161616] text-[#A7A29B] hover:text-[#F4EFE7] border border-[#F4EFE7]/10 text-[11px]"
                        >
                          {a.is_public ? 'Hide' : 'Make Public'}
                        </button>

                        <button
                          onClick={() => handleToggleDistinguished(a)}
                          className="px-2.5 py-1 rounded bg-[#6E1F32]/40 text-[#B89B5E] hover:bg-[#6E1F32] border border-[#B89B5E]/30 text-[11px] font-semibold"
                        >
                          {a.is_distinguished ? 'Remove Badge' : 'Make Distinguished'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Add Alumni */}
      {activeTab === 'add_alumni' && (
        <div className="space-y-10">
          {/* SECTION 1: MASTER VERIFICATION RECORD */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#6E1F32]/40 text-[#B89B5E] text-[10px] uppercase font-bold tracking-wider mb-1">
                  <span>Section 1 of 2</span>
                </div>
                <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Add Alumni to Master Database</h2>
                <p className="text-xs text-[#A7A29B]">Register a new official alumni record for verification.</p>
              </div>
            </div>

            <form onSubmit={handleAddAlumniMaster} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Register Number</label>
                <input type="text" required value={newAlumniRegNo} onChange={e => setNewAlumniRegNo(e.target.value)} className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono uppercase" placeholder="e.g. AMC21CSE001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Full Name</label>
                <input type="text" required value={newAlumniName} onChange={e => setNewAlumniName(e.target.value)} className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none" placeholder="e.g. Arun Kumar" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Registered Email (College)</label>
                <input type="email" required value={newAlumniEmail} onChange={e => setNewAlumniEmail(e.target.value)} className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none" placeholder="e.g. arun@amcet.edu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Batch</label>
                  <input type="text" value={newAlumniBatch} onChange={e => setNewAlumniBatch(e.target.value)} className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono" placeholder="e.g. 2021-2025" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Graduation Year</label>
                  <input type="number" value={newAlumniYear} onChange={e => setNewAlumniYear(e.target.value)} className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono" placeholder="e.g. 2025" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl burgundy-gradient-btn text-white text-xs font-bold uppercase tracking-wider shadow-lg mt-4 transition-all hover:scale-[1.02]">
                Add Master Record
              </button>
            </form>
          </div>

          {/* SECTION 2: CAREER JOURNEY & KEY ACHIEVEMENTS */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B89B5E]/30 space-y-8 relative overflow-hidden shadow-2xl">
            {/* Section Header */}
            <div className="border-b border-[#F4EFE7]/10 pb-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#B89B5E]/20 text-[#B89B5E] text-[10px] uppercase font-bold tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Section 2 of 2 — Career Journey & Achievements</span>
                </div>
                <h2 className="font-serif font-bold text-2xl text-[#F4EFE7]">
                  Alumni Career Journey & Milestone Management
                </h2>
                <p className="text-xs text-[#A7A29B] max-w-2xl mt-1">
                  Attach and configure career progression milestones (Zoho, TCS, internships) and collegiate honor awards to verified alumni records.
                </p>
              </div>
            </div>

            {/* Main Content: 2-Column Grid (Left: Forms to add items, Right: Live Timeline & Achievement Preview) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form to add milestone and achievement */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 2A. Add Work Experience Form */}
                <div className="p-5 rounded-2xl bg-[#161616]/90 border border-[#F4EFE7]/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-3">
                    <h3 className="font-serif font-bold text-sm text-[#F4EFE7] flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-[#B89B5E]" />
                      <span>Add Career Experience Entry</span>
                    </h3>
                    <span className="text-[10px] text-[#B89B5E] bg-[#6E1F32]/30 px-2 py-0.5 rounded border border-[#B89B5E]/20">
                      Work Timeline
                    </span>
                  </div>

                  <form onSubmit={handleAddJourneyExperience} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                        Designation / Role Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newExpDesignation}
                        onChange={(e) => setNewExpDesignation(e.target.value)}
                        placeholder="e.g. Software Engineer, Intern"
                        className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={newExpCompany}
                        onChange={(e) => setNewExpCompany(e.target.value)}
                        placeholder="e.g. Zoho Corporation, TCS, Deloitte"
                        className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                          Start Date / Year
                        </label>
                        <input
                          type="text"
                          value={newExpStartDate}
                          onChange={(e) => setNewExpStartDate(e.target.value)}
                          placeholder="e.g. 2024 or 2025-06-01"
                          className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                          End Date / Year
                        </label>
                        <input
                          type="text"
                          disabled={newExpIsCurrent}
                          value={newExpIsCurrent ? 'Present' : newExpEndDate}
                          onChange={(e) => setNewExpEndDate(e.target.value)}
                          placeholder="e.g. 2024 or Present"
                          className={`w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono ${
                            newExpIsCurrent ? 'opacity-50 cursor-not-allowed text-[#B89B5E]' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="isCurrentRole"
                        checked={newExpIsCurrent}
                        onChange={(e) => setNewExpIsCurrent(e.target.checked)}
                        className="rounded border-[#F4EFE7]/20 bg-[#0D0D0D] text-[#B89B5E] focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isCurrentRole" className="text-xs text-[#F4EFE7] cursor-pointer">
                        Currently working here (Present)
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                        Role Description / Responsibilities
                      </label>
                      <textarea
                        rows={2}
                        value={newExpDescription}
                        onChange={(e) => setNewExpDescription(e.target.value)}
                        placeholder="e.g. Building cloud infrastructure and microservices."
                        className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6E1F32] to-[#B89B5E] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-transform"
                    >
                      + Add Career Milestone
                    </button>
                  </form>
                </div>

                {/* 2B. Add Key Achievement Form */}
                <div className="p-5 rounded-2xl bg-[#161616]/90 border border-[#F4EFE7]/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-3">
                    <h3 className="font-serif font-bold text-sm text-[#F4EFE7] flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#B89B5E]" />
                      <span>Add Key Achievement / Honor</span>
                    </h3>
                    <span className="text-[10px] text-[#B89B5E] bg-[#6E1F32]/30 px-2 py-0.5 rounded border border-[#B89B5E]/20">
                      College Award
                    </span>
                  </div>

                  <form onSubmit={handleAddJourneyAchievement} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                        Award / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAchTitle}
                        onChange={(e) => setNewAchTitle(e.target.value)}
                        placeholder="e.g. Best Outstanding Student Award"
                        className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                          Organization / Event
                        </label>
                        <input
                          type="text"
                          value={newAchOrg}
                          onChange={(e) => setNewAchOrg(e.target.value)}
                          placeholder="e.g. AMCET College Day"
                          className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          value={newAchYear}
                          onChange={(e) => setNewAchYear(e.target.value)}
                          placeholder="e.g. 2025"
                          className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#B89B5E] mb-1">
                        Award Description
                      </label>
                      <textarea
                        rows={2}
                        value={newAchDesc}
                        onChange={(e) => setNewAchDesc(e.target.value)}
                        placeholder="e.g. Awarded for academic excellence and leadership in technical symposiums."
                        className="w-full bg-[#0D0D0D] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#1E1A1B] text-[#B89B5E] border border-[#B89B5E]/40 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#6E1F32] hover:text-white transition-colors"
                    >
                      + Add Key Achievement
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Live Visualizer matching Modal & Screenshots */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0D0D0D]/90 border border-[#B89B5E]/30 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <h3 className="font-serif font-bold text-base text-[#F4EFE7]">
                        Live Profile Journey & Timeline Preview
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#A7A29B] font-mono">
                      {journeyExperiences.length} experiences • {journeyAchievements.length} awards
                    </span>
                  </div>

                  {/* Career Journey Timeline */}
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#B89B5E] uppercase tracking-wider mb-4 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-[#B89B5E]" />
                      <span>Career Journey</span>
                    </h4>

                    {journeyExperiences.length > 0 ? (
                      <div className="space-y-4 relative border-l-2 border-[#6E1F32] ml-3 pl-5">
                        {journeyExperiences.map((exp) => (
                          <div key={exp.id} className="relative group">
                            {/* Gold Bullet node on vertical timeline */}
                            <div className="w-3.5 h-3.5 rounded-full bg-[#B89B5E] absolute -left-[27px] top-1.5 border-2 border-[#0D0D0D] shadow-sm" />
                            
                            <div className="bg-[#161616] p-4 rounded-xl border border-[#F4EFE7]/10 hover:border-[#B89B5E]/40 transition-colors relative">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h5 className="font-semibold text-sm text-[#F4EFE7]">{exp.designation}</h5>
                                  <p className="text-xs text-[#B89B5E] font-medium">{exp.company_name}</p>
                                  <p className="text-[11px] text-[#A7A29B] mt-0.5">
                                    {exp.start_date ? (exp.start_date.length > 4 ? new Date(exp.start_date).getFullYear() : exp.start_date) : ''} - {exp.is_current ? 'Present' : exp.end_date ? (exp.end_date.length > 4 ? new Date(exp.end_date).getFullYear() : exp.end_date) : ''}
                                  </p>
                                  {exp.description && (
                                    <p className="text-xs text-[#A7A29B]/90 mt-2 leading-relaxed">
                                      {exp.description}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveJourneyExperience(exp.id)}
                                  className="text-[#A7A29B] hover:text-red-400 p-1 rounded-lg hover:bg-red-950/30 transition-colors"
                                  title="Remove entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#161616]/40 border border-dashed border-[#F4EFE7]/10 text-center">
                        <p className="text-xs text-[#A7A29B] italic">No career experiences added yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Key Achievements Grid */}
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#B89B5E] uppercase tracking-wider mb-3 flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#B89B5E]" />
                      <span>Key Achievements</span>
                    </h4>

                    {journeyAchievements.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {journeyAchievements.map((ach) => (
                          <div key={ach.id} className="bg-[#161616] p-4 rounded-xl border border-[#B89B5E]/30 relative group">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-semibold text-xs text-[#F4EFE7]">{ach.title}</h5>
                              <button
                                type="button"
                                onClick={() => handleRemoveJourneyAchievement(ach.id)}
                                className="text-[#A7A29B] hover:text-red-400 p-0.5 rounded transition-colors"
                                title="Remove achievement"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-[#B89B5E] mt-0.5">
                              {ach.organization} {ach.year ? `(${ach.year})` : ''}
                            </p>
                            {ach.description && (
                              <p className="text-xs text-[#A7A29B]/80 mt-1.5 leading-relaxed">
                                {ach.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#161616]/40 border border-dashed border-[#F4EFE7]/10 text-center">
                        <p className="text-xs text-[#A7A29B] italic">No key achievements added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Departments */}
      {activeTab === 'departments' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">AMCET Engineering Departments</h2>
              <p className="text-xs text-[#A7A29B]">Manage academic department codes and definitions.</p>
            </div>

            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-[#B89B5E]" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl bg-[#161616] border border-[#B89B5E]/20 space-y-2">
                <span className="px-2.5 py-1 rounded bg-[#6E1F32]/40 text-[#B89B5E] font-mono font-bold text-xs border border-[#B89B5E]/30 inline-block">
                  {d.code}
                </span>
                <h3 className="font-semibold text-sm text-[#F4EFE7]">{d.name}</h3>
                <span className="text-[10px] text-green-400 block font-mono">Status: Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Companies & Industries */}
      {activeTab === 'companies' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#F4EFE7]/10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4EFE7]/10 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F4EFE7]">Companies & Industries Master Data</h2>
              <p className="text-xs text-[#A7A29B]">Manage corporate employers and industry sectors.</p>
            </div>

            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-[#B89B5E]" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-[#161616] border border-[#F4EFE7]/10 space-y-1 text-xs">
                <h3 className="font-bold text-sm text-[#F4EFE7]">{c.name}</h3>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-[#B89B5E] text-[11px] hover:underline block">
                    {c.website}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {showRejectModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-red-500/40 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Reject Profile Update Request</h3>
            <p className="text-xs text-[#A7A29B]">Specify reason for rejecting this alumni change request.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Rejection Reason</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedReq(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Department */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-[#B89B5E]/30 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Add New Department</h3>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIVIL"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none uppercase font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-bold shadow-md">
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Company */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-[#B89B5E]/30 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Add New Corporate Employer</h3>

            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cognizant"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://cognizant.com"
                  value={newCompWebsite}
                  onChange={(e) => setNewCompWebsite(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl burgundy-gradient-btn text-white text-xs font-bold shadow-md">
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Account Registration Approval & Distinguished Alumni Status */}
      {showApproveRegModal && selectedRegUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-green-500/40 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-2 border-b border-[#F4EFE7]/10 pb-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Approve Alumni Account</h3>
                <p className="text-xs text-[#A7A29B]">Verify applicant details and configure public directory status.</p>
              </div>
            </div>

            {/* Applicant Summary */}
            <div className="bg-[#161616] p-4 rounded-xl border border-[#F4EFE7]/10 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <p><strong className="text-[#B89B5E]">Name:</strong> {selectedRegUser.alumni?.name || 'N/A'}</p>
                <p><strong className="text-[#B89B5E]">Email:</strong> {selectedRegUser.email}</p>
                <p><strong className="text-[#B89B5E]">Reg No:</strong> {selectedRegUser.register_number || selectedRegUser.alumni?.register_number || 'N/A'}</p>
                <p><strong className="text-[#B89B5E]">Dept:</strong> {selectedRegUser.alumni?.department?.name || selectedRegUser.alumni?.department?.code || 'N/A'}</p>
                <p><strong className="text-[#B89B5E]">Batch:</strong> {selectedRegUser.alumni?.batch || 'N/A'}</p>
                <p><strong className="text-[#B89B5E]">Grad Year:</strong> {selectedRegUser.alumni?.graduation_year || 'N/A'}</p>
              </div>
            </div>

            <form onSubmit={handleApproveRegistrationSubmit} className="space-y-4">
              {/* Distinguished Alumni Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#6E1F32]/20 border border-[#B89B5E]/40 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="distinguished_checkbox"
                  checked={isDistinguishedInput}
                  onChange={(e) => setIsDistinguishedInput(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#B89B5E] text-[#6E1F32] focus:ring-[#B89B5E]"
                />
                <label htmlFor="distinguished_checkbox" className="text-xs cursor-pointer select-none space-y-0.5">
                  <span className="font-bold text-[#F4EFE7] block flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-[#B89B5E] inline mr-1" />
                    Mark as Distinguished Alumni?
                  </span>
                  <span className="text-[#A7A29B] block text-[11px]">
                    If checked, this alumnus will be highlighted on the Distinguished Alumni page and Directory badges.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowApproveRegModal(false);
                    setSelectedRegUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-lg transition-all"
                >
                  Confirm & Activate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Account Registration Rejection */}
      {showRejectRegModal && selectedRegUserReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-red-500/40 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#F4EFE7]">Reject Account Registration</h3>
            <p className="text-xs text-[#A7A29B]">
              Specify reason for rejecting account registration for <strong className="text-[#F4EFE7]">{selectedRegUserReject.email}</strong>.
            </p>

            <form onSubmit={handleRejectRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Rejection Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Invalid registration number or record not found in college database."
                  value={regRejectionReason}
                  onChange={(e) => setRegRejectionReason(e.target.value)}
                  className="w-full bg-[#161616] px-3 py-2 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectRegModal(false);
                    setSelectedRegUserReject(null);
                    setRegRejectionReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Alumni Profile & Request Approval */}
      {showEditAlumniModal && editingAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-[#B89B5E]/40 space-y-5 shadow-2xl my-auto">
            <div className="flex items-start justify-between border-b border-[#F4EFE7]/10 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#6E1F32]/40 border border-[#B89B5E]/40 text-xs text-[#B89B5E] mb-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89B5E]" />
                  <span>Admin Profile Management & Verification Gateway</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#F4EFE7]">
                  Edit Alumni Profile: <span className="text-[#B89B5E]">{editingAlumni.name}</span>
                </h3>
                <p className="text-xs text-[#A7A29B] mt-1">
                  Registration No: <strong className="font-mono text-[#F4EFE7]">{editingAlumni.register_number}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditAlumniModal(false);
                  setEditingAlumni(null);
                }}
                className="text-[#A7A29B] hover:text-[#F4EFE7] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Note alert */}
            <div className="p-3.5 rounded-xl bg-[#6E1F32]/20 border border-[#B89B5E]/30 flex items-start space-x-2.5 text-xs text-[#F4EFE7]">
              <AlertCircle className="w-4 h-4 text-[#B89B5E] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#B89B5E] font-semibold block">Admin Approval Workflow Notice:</strong>
                Submitting updates here will automatically generate an official Profile Update Approval Request in the Admin Review Queue (Tab 1), preserving audit trail and data validation before applying across the public directory.
              </div>
            </div>

            <form onSubmit={handleSaveEditProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                    placeholder="e.g. Arun Kumar"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Department</label>
                  <select
                    value={editDepartmentId}
                    onChange={(e) => setEditDepartmentId(e.target.value)}
                    className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Current Designation</label>
                  <input
                    type="text"
                    required
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Current Company</label>
                  <input
                    type="text"
                    required
                    list="companies-edit-list"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                    placeholder="e.g. Zoho / TCS / Infosys"
                  />
                  <datalist id="companies-edit-list">
                    {companies.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Batch</label>
                  <input
                    type="text"
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
                    placeholder="e.g. 2021-2025"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
                    placeholder="e.g. 2025"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Work Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                    placeholder="e.g. Chennai, India / Remote"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                    placeholder="e.g. arun@amcet.edu"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                  placeholder="e.g. https://linkedin.com/in/username"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-[#B89B5E] mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
                  placeholder="Enter a brief background, career focus, and achievements..."
                />
              </div>

              {/* Visibility & Distinguished Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#161616] border border-[#F4EFE7]/10 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="edit_is_public"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#B89B5E] text-[#6E1F32] focus:ring-[#B89B5E]"
                  />
                  <label htmlFor="edit_is_public" className="text-xs cursor-pointer select-none space-y-0.5">
                    <span className="font-bold text-[#F4EFE7] flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-[#B89B5E] inline mr-1" />
                      Visible in Public Directory
                    </span>
                    <span className="text-[#A7A29B] block text-[11px]">
                      When checked, this profile will appear in the public Alumni Directory.
                    </span>
                  </label>
                </div>

                <div className="p-3.5 rounded-xl bg-[#6E1F32]/20 border border-[#B89B5E]/30 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="edit_is_distinguished"
                    checked={editIsDistinguished}
                    onChange={(e) => setEditIsDistinguished(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#B89B5E] text-[#6E1F32] focus:ring-[#B89B5E]"
                  />
                  <label htmlFor="edit_is_distinguished" className="text-xs cursor-pointer select-none space-y-0.5">
                    <span className="font-bold text-[#F4EFE7] flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-[#B89B5E] inline mr-1" />
                      Distinguished Alumni Badge
                    </span>
                    <span className="text-[#A7A29B] block text-[11px]">
                      Highlight on Distinguished page and showcase with gold badge.
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#F4EFE7]/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAlumniModal(false);
                    setEditingAlumni(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#161616] text-[#A7A29B] text-xs font-semibold hover:text-[#F4EFE7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6E1F32] to-[#B89B5E] hover:opacity-95 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Submit Profile Update Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
