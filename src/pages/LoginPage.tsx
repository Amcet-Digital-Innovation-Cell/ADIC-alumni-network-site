import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await signIn(email, password);
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#B89B5E]/30 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E1A1B] border border-[#B89B5E]/30 text-xs text-[#B89B5E]">
            <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
            <span>AMCET Alumni Portal</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#F4EFE7]">Alumni Sign In</h1>
          <p className="text-xs text-[#A7A29B]">
            Sign in to access your personal alumni dashboard, profile update requests, and notifications.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#B89B5E] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A7A29B] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="your.email@amcet.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B89B5E] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A7A29B] absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161616] pl-9 pr-3 py-2.5 rounded-xl text-xs text-[#F4EFE7] placeholder-[#A7A29B]/40 border border-[#F4EFE7]/10 focus:border-[#B89B5E] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl burgundy-gradient-btn text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]"
          >
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#A7A29B]">
          <span>Not registered yet? </span>
          <Link to="/register" className="text-[#B89B5E] font-semibold hover:underline">
            Claim Your Profile Record
          </Link>
        </div>
      </div>
    </div>
  );
};
