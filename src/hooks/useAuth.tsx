import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../services/authService';
import { alumniService } from '../services/alumniService';
import { UserProfile, AlumniProfile } from '../types/database';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  alumniProfile: AlumniProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAlumni: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [alumniProfile, setAlumniProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async (uid: string) => {
    try {
      const uProf = await authService.getUserProfile(uid);
      setUserProfile(uProf);

      const aProf = await alumniService.getAlumniProfileByUserId(uid);
      setAlumniProfile(aProf);
    } catch (err) {
      console.error('Error fetching user profiles:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        const currentSessionUser = data.session?.user || null;
        setUser(currentSessionUser);

        if (currentSessionUser) {
          await fetchProfiles(currentSessionUser.id);
        }
      } else {
        const mockUserStr = localStorage.getItem('amcet_mock_user');
        if (mockUserStr) {
          const mockUser = JSON.parse(mockUserStr);
          setUser(mockUser);
          setUserProfile({
            id: mockUser.id,
            email: mockUser.email,
            role: mockUser.role || 'alumni',
            registration_status: 'approved',
            is_verified: true,
          });
          const aProf = await alumniService.getAlumniProfileByUserId(mockUser.id);
          setAlumniProfile(aProf);
        }
      }

      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfiles(currentUser.id);
        } else {
          setUserProfile(null);
          setAlumniProfile(null);
        }
        setLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    const res = await authService.signIn(email, pass);
    if (res.user) {
      setUser(res.user);
      await fetchProfiles(res.user.id);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserProfile(null);
    setAlumniProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfiles(user.id);
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isAlumni = userProfile?.role === 'alumni';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        alumniProfile,
        loading,
        isAdmin,
        isAlumni,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
