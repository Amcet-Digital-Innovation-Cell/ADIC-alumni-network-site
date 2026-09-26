import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { profileRequestService } from '../services/profileRequestService';
import { alumniService, SAMPLE_DEPARTMENTS, SAMPLE_COMPANIES, SAMPLE_INDUSTRIES } from '../services/alumniService';
import { ProfileUpdateRequest, AlumniProfile, Department, Company, Industry, AlumniMaster, UserProfile } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, Users, Building2, Layers, 
  RefreshCw, Search, Plus, Award, Eye, EyeOff, FileText, CheckSquare, XSquare, AlertCircle, UserCheck
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'master' | 'alumni' | 'departments' | 'companies'>('requests');
  
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

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [reqs, pendingRegs, alumni, depts, comps, inds] = await Promise.all([
        profileRequestService.getPendingRequests(),
        authService.getPendingRegistrations(),
        alumniService.getPublicAlumniProfiles(),
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

      if (isSupabaseConfigured) {
        const { data } = await supabase.from('alumni_master').select('*').order('register_number');
        if (data) setMasterRecords(data as AlumniMaster[]);
      } else {
        setMasterRecords([
          { register_number: 'AMC21CSE001', name: 'Arun Kumar', registered_email: 'arun.sample@amcet.edu', batch: '2021-2025', graduation_year: 2025, is_claimed: true },
          { register_number: 'AMC21CSE002', name: 'Priya Sharma', registered_email: 'priya.sample@amcet.edu', batch: '2021-2025', graduation_year: 2025, is_claimed: false },
          { register_number: 'AMC20ECE015', name: 'Rahul Kumar', registered_email: 'rahul.sample@amcet.edu', batch: '2020-2024', graduation_year: 2024, is_claimed: false },
          { register_number: 'AMC19IT008', name: 'Meena Raj', registered_email: 'meena.sample@amcet.edu', batch: '2019-2023', graduation_year: 2023, is_claimed: false },
        ]);
      }
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

  const handleToggleDistinguished = async (alumni: AlumniProfile) => {
    const updatedStatus = !alumni.is_distinguished;
    if (isSupabaseConfigured) {
      await supabase.from('alumni_profiles').update({ is_distinguished: updatedStatus }).eq('id', alumni.id);
    }
    setAlumniList((prev) =>
      prev.map((item) => (item.id === alumni.id ? { ...item, is_distinguished: updatedStatus } : item))
    );
    setActionMsg(`Distinguished status updated for ${alumni.name}.`);
  };

  const handleTogglePublicVisibility = async (alumni: AlumniProfile) => {
    const updatedStatus = !alumni.is_public;
    if (isSupabaseConfigured) {
      await supabase.from('alumni_profiles').update({ is_public: updatedStatus }).eq('id', alumni.id);
    }
    setAlumniList((prev) =>
      prev.map((item) => (item.id === alumni.id ? { ...item, is_public: updatedStatus } : item))
    );
    setActionMsg(`Public visibility updated for ${alumni.name}.`);
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
                    <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-red-500/20 space-y-1">
                      <span className="text-red-400 font-bold uppercase text-[10px] block mb-1">Current Snapshot</span>
                      <p><strong className="text-[#A7A29B]">Designation:</strong> {req.current_snapshot?.current_designation || 'N/A'}</p>
                      <p><strong className="text-[#A7A29B]">Location:</strong> {req.current_snapshot?.location || 'N/A'}</p>
                      <p><strong className="text-[#A7A29B]">Bio:</strong> {req.current_snapshot?.bio || 'N/A'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-green-500/30 space-y-1">
                      <span className="text-green-400 font-bold uppercase text-[10px] block mb-1">Requested Changes</span>
                      <p><strong className="text-[#A7A29B]">Designation:</strong> {req.requested_changes?.current_designation || 'N/A'}</p>
                      <p><strong className="text-[#A7A29B]">Location:</strong> {req.requested_changes?.location || 'N/A'}</p>
                      <p><strong className="text-[#A7A29B]">Bio:</strong> {req.requested_changes?.bio || 'N/A'}</p>
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
              <p className="text-xs text-[#A7A29B]">Toggle public visibility and distinguished alumni badges.</p>
            </div>

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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#B89B5E] font-semibold border-b border-[#F4EFE7]/10">
                <tr>
                  <th className="p-3">Name & Reg No</th>
                  <th className="p-3">Designation / Company</th>
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
                      {a.is_public ? (
                        <span className="px-2 py-0.5 rounded bg-green-950/60 text-green-300 border border-green-500/30 text-[10px]">
                          Publicly Visible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/30 text-[10px]">
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
                    <td className="p-3 flex items-center space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};
