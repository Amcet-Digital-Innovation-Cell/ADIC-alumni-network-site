import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Award, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#F4EFE7]/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & College Identity */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6E1F32] to-[#B89B5E] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img
              src="/amcet-logo.png"
              alt="Annai Mira College Logo"
              className="w-full h-full object-contain rounded-full bg-[#0D0D0D] p-1 border border-[#B89B5E]/30"
              onError={(e) => {
                // Fallback to text initials if image is not loaded
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold tracking-tight text-[#F4EFE7]">AMCET Alumni Network</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6E1F32]/40 text-[#B89B5E] border border-[#B89B5E]/30 font-mono font-bold">
                TNEA: 1137
              </span>
            </div>
            <p className="text-[11px] text-[#A7A29B]/80 tracking-wider">Annai Mira College of Engineering & Technology, Vellore</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-[#F4EFE7]/80 hover:text-[#B89B5E] transition-colors">
            Home
          </Link>
          <Link to="/directory" className="text-[#F4EFE7]/80 hover:text-[#B89B5E] transition-colors">
            Alumni Directory
          </Link>
          <Link to="/distinguished" className="text-[#F4EFE7]/80 hover:text-[#B89B5E] transition-colors flex items-center space-x-1">
            <Award className="w-4 h-4 text-[#B89B5E]" />
            <span>Distinguished Alumni</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-[#F4EFE7]/10">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#6E1F32] text-white border border-[#B89B5E]/40 hover:bg-[#87273e] transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                  <span>Admin Gateway</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#1E1A1B] text-[#F4EFE7] border border-[#B89B5E]/30 hover:border-[#B89B5E] transition-colors"
                >
                  <User className="w-4 h-4 text-[#B89B5E]" />
                  <span>My Dashboard</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-[#A7A29B] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 pl-4 border-l border-[#F4EFE7]/10">
              <Link to="/login" className="px-3.5 py-1.5 rounded-md text-sm text-[#F4EFE7] hover:text-[#B89B5E] transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md text-sm font-semibold burgundy-gradient-btn text-white shadow-md transition-all hover:scale-105"
              >
                Claim Record
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-[#F4EFE7] hover:bg-[#1E1A1B]">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#F4EFE7]/10 space-y-3 pb-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[#F4EFE7]">
            Home
          </Link>
          <Link to="/directory" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[#F4EFE7]">
            Alumni Directory
          </Link>
          <Link to="/distinguished" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[#B89B5E]">
            Distinguished Alumni
          </Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[#B89B5E] font-semibold">
                  Admin Gateway
                </Link>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[#F4EFE7]">
                  My Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-[#F4EFE7]/10 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-[#F4EFE7]">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 rounded-md burgundy-gradient-btn text-white font-semibold">
                Claim Official Profile
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
