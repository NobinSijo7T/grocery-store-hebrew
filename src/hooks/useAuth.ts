// ============================================================
// useAuth Hook
// ============================================================
// Manages authentication state and session lifecycle.

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Customer } from '@/types/models';

export function useAuth() {
  const { session, customer, isLoading, isAdmin, setSession, setCustomer, setLoading, reset } =
    useAuthStore();

  // Fetch customer profile from database
  const fetchCustomer = useCallback(async (userId: string) => {
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
      }
    } catch (err) {
      console.error('Error in fetchCustomer:', err);
    }
  }, [setCustomer]);

  // Initialize auth state
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchCustomer(currentSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchCustomer(newSession.user.id);
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
    signOut,
    resetPassword,
  };
}
