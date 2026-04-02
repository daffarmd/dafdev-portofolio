import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { ProfileRole } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AuthProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: ProfileRole;
};

type AuthContextValue = {
  isConfigured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  isAdmin: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: (userId?: string | null) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const mapProfile = (value: unknown): AuthProfile | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const profile = value as Record<string, unknown>;
  const role = profile.role === 'admin' ? 'admin' : 'viewer';

  return {
    id: typeof profile.id === 'string' ? profile.id : '',
    email: typeof profile.email === 'string' ? profile.email : null,
    fullName: typeof profile.full_name === 'string' ? profile.full_name : null,
    role,
  };
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (userId?: string | null) => {
    if (!isSupabaseConfigured || !supabase || !userId) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(mapProfile(data));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const bootstrapAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(data.session);
      await refreshProfile(data.session?.user.id ?? null);
      if (mounted) {
        setLoading(false);
      }
    };

    void bootstrapAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void refreshProfile(nextSession?.user.id ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error?.message ?? null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Request login gagal dijalankan.',
      };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    isConfigured: isSupabaseConfigured,
    loading,
    session,
    user: session?.user ?? null,
    profile,
    isAdmin: profile?.role === 'admin',
    signInWithPassword,
    signOut,
    refreshProfile,
  }), [loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
