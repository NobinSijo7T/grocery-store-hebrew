// ============================================================
// useAuth Hook
// ============================================================
// Manages authentication state and session lifecycle.

import { useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Customer } from '@/types/models';

WebBrowser.maybeCompleteAuthSession();

// Helper to extract query & hash parameters returned from OAuth callback
function parseAuthUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const queryParts: string[] = [];

  if (url.includes('?')) {
    queryParts.push(url.split('?')[1].split('#')[0]);
  }
  if (url.includes('#')) {
    queryParts.push(url.split('#')[1]);
  }

  for (const part of queryParts) {
    for (const pair of part.split('&')) {
      const [key, value] = pair.split('=');
      if (key && value && !params[key]) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }
  }

  return params;
}

export function useAuth() {
  const { session, customer, isLoading, isAdmin, setSession, setCustomer, setLoading, reset } =
    useAuthStore();

  // Fetch customer profile from database, or auto-create if new OAuth user
  const fetchCustomer = useCallback(
    async (userId: string, userMetadata?: any, userEmail?: string) => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching customer:', error);
          return;
        }

        if (data) {
          setCustomer(data as Customer);
        } else {
          // Auto-create customer record for OAuth/Google users
          const fullName =
            userMetadata?.full_name ||
            userMetadata?.name ||
            userEmail?.split('@')[0] ||
            'Customer';
          const { data: newCustomer, error: insertError } = await supabase
            .from('customers')
            .insert({
              auth_user_id: userId,
              full_name: fullName,
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating customer for OAuth user:', insertError);
          } else if (newCustomer) {
            setCustomer(newCustomer as Customer);
          }
        }
      } catch (err) {
        console.error('Error in fetchCustomer:', err);
      }
    },
    [setCustomer]
  );

  // Initialize auth state
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchCustomer(
          currentSession.user.id,
          currentSession.user.user_metadata,
          currentSession.user.email
        );
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchCustomer(
          newSession.user.id,
          newSession.user.user_metadata,
          newSession.user.email
        );
      } else {
        setCustomer(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setCustomer, setLoading, fetchCustomer]);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Create customer record
    if (data.user) {
      const { error: customerError } = await supabase.from('customers').insert({
        auth_user_id: data.user.id,
        full_name: fullName,
        phone: phone || null,
      });
      if (customerError) {
        console.error('Error creating customer:', customerError);
      }
    }

    return data;
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    const redirectTo = Linking.createURL('auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) {
      throw new Error('No authorization URL returned from Supabase');
    }

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (res.type === 'success' && res.url) {
      const params = parseAuthUrlParams(res.url);

      if (params.error || params.error_description) {
        throw new Error(params.error_description || params.error || 'Authentication failed');
      }

      if (params.code) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.exchangeCodeForSession(params.code);
        if (sessionError) throw sessionError;
        if (sessionData.session?.user) {
          await fetchCustomer(
            sessionData.session.user.id,
            sessionData.session.user.user_metadata,
            sessionData.session.user.email
          );
        }
        return sessionData;
      } else if (params.access_token && params.refresh_token) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        if (sessionError) throw sessionError;
        if (sessionData.session?.user) {
          await fetchCustomer(
            sessionData.session.user.id,
            sessionData.session.user.user_metadata,
            sessionData.session.user.email
          );
        }
        return sessionData;
      }
    } else if (res.type === 'cancel' || res.type === 'dismiss') {
      return null;
    }

    return null;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    reset();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  return {
    session,
    customer,
    isLoading,
    isAdmin,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
