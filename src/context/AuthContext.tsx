import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { ProfileRole } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

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
  requestPasswordReset: (email: string, redirectTo?: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
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

  const refreshProfile = useCallback(async (userId?: string | null) => {
    if (!isSupabaseConfigured || !userId) {
      setProfile(null);
      return;
    }

    const client = await getSupabaseClient();

    if (!client) {
      setProfile(null);
      return;
    }

    const { data, error } = await client
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(mapProfile(data));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let subscription:
      | {
          unsubscribe: () => void;
        }
      | undefined;

    const bootstrapAuth = async () => {
      setLoading(true);

      const client = await getSupabaseClient();

      if (!mounted || !client) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      const { data } = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(data.session);
      await refreshProfile(data.session?.user.id ?? null);
      if (mounted) {
        setLoading(false);
      }

      const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        void refreshProfile(nextSession?.user.id ?? null);
      });

      subscription = listener.subscription;
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        void bootstrapAuth();
      }, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(() => {
        void bootstrapAuth();
      }, 300);
    }

    return () => {
      mounted = false;
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
      subscription?.unsubscribe();
    };
  }, [refreshProfile]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    const client = await getSupabaseClient();

    if (!client) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error?.message ?? null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Request login gagal dijalankan.',
      };
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string, redirectTo?: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    const client = await getSupabaseClient();

    if (!client) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      return { error: error?.message ?? null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Request reset password gagal dijalankan.',
      };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    const client = await getSupabaseClient();

    if (!client) {
      return { error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { error } = await client.auth.updateUser({ password });

      return { error: error?.message ?? null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Update password gagal dijalankan.',
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = await getSupabaseClient();

    if (!client) {
      return;
    }

    await client.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isConfigured: isSupabaseConfigured,
    loading,
    session,
    user: session?.user ?? null,
    profile,
    isAdmin: profile?.role === 'admin',
    signInWithPassword,
    requestPasswordReset,
    updatePassword,
    signOut,
    refreshProfile,
  }), [loading, profile, refreshProfile, requestPasswordReset, session, signInWithPassword, signOut, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
