import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { alumniService } from '../services/alumniService';
import { Department } from '../types/database';
import { ShieldCheck, CheckCircle2, AlertCircle, Lock, Mail, User, GraduationCap, Clock } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [batch, setBatch] = useState('2021-2025');
  const [graduationYear, setGraduationYear] = useState('2025');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedPending, setSubmittedPending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    alumniService.getDepartments().then(setDepartments);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Supabase Auth Account
      const authRes = await authService.signUp(email, password);
      const userId = authRes.user?.id || 'mock-user-' + Date.now();

      // 2. Register User Profile & Alumni Profile with registration_status = 'pending'
      await authService.registerAlumniUser(
        userId,
        email,
        name,
        registerNumber,
        departmentId,
        batch,
        parseInt(graduationYear, 10)
      );

      setSubmittedPending(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedPending) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#B89B5E]/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#B89B5E]/20 text-[#B89B5E] border border-[#B89B5E]/40 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#F4EFE7]">Registration Pending Admin Approval</h2>
          <p className="text-xs text-[#A7A29B] leading-relaxed">
            Thank you for registering, <strong className="text-[#F4EFE7]">{name}</strong>! Your alumni profile has been submitted and is currently pending review by college administrators.
          </p>
          <div className="p-4 rounded-xl bg-[#161616] border border-[#F4EFE7]/10 text-xs text-[#A7A29B]">
            Once approved, your account will be activated and you can sign in to access your Alumni Dashboard.
          </div>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 rounded-xl burgundy-gradient-btn text-white text-xs font-bold uppercase tracking-wider shadow-md"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#B89B5E]/30 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E1A1B] border border-[#B89B5E]/30 text-xs text-[#B89B5E] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
            <span>Official AMCET Alumni Registration</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#F4EFE7]">Register Alumni Account</h1>
          <p className="text-xs text-[#A7A29B]">
            Join the Annai Mira College of Engineering & Technology digital alumni network.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A7A29B] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Arun Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A7A29B] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. arun.sample@amcet.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A7A29B] absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
                Register Number
              </label>
              <input
                type="text"
                placeholder="e.g. AMC21CSE001"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
                Batch
              </label>
              <input
                type="text"
                placeholder="2021-2025"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B89B5E] mb-1 uppercase tracking-wider">
                Graduation Year
              </label>
              <input
                type="number"
                placeholder="2025"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full bg-[#161616] px-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl burgundy-gradient-btn text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]"
          >
            {loading ? 'Submitting Registration...' : 'Submit Registration for Verification'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#A7A29B]">
          <span>Already registered? </span>
          <Link to="/login" className="text-[#B89B5E] font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
