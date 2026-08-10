// ============================================================
// Auth Store — Zustand
// ============================================================

import { create } from 'zustand';
import type { Customer, UserRole } from '@/types/models';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  customer: Customer | null;
  isLoading: boolean;
  isAdmin: boolean;

  setSession: (session: Session | null) => void;
  setCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  customer: null,
  isLoading: true,
  isAdmin: false,

  setSession: (session) => set({ session }),
  setCustomer: (customer) =>
    set({
      customer,
      isAdmin: customer?.role === 'admin' || customer?.role === 'staff',
    }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      session: null,
      customer: null,
      isLoading: false,
      isAdmin: false,
    }),
}));
