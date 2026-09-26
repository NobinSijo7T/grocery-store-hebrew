// ============================================================
// useAddresses Hook — Manage Customer Delivery Addresses
// ============================================================
// Full CRUD operations for customer addresses:
// - Query addresses ordered by default first
// - Add address (with graceful fallback for new schema columns)
// - Update address
// - Delete address
// - Set address as default

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Address } from '@/types/models';
import { useAuthStore } from '@/stores/authStore';

export interface AddressFormData {
  label: string;
  street: string;
  city: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  postal_code?: string;
  notes?: string;
  is_default?: boolean;
}

export function useAddresses() {
  const customer = useAuthStore((s) => s.customer);
  const setCustomer = useAuthStore((s) => s.setCustomer);
  const queryClient = useQueryClient();

  const queryKey = ['addresses', customer?.id];

  // 1. Fetch Addresses
  const {
    data: addresses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!customer?.id) return [];

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customer.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Address[]) || [];
    },
    enabled: !!customer?.id,
  });

  // 2. Add Address Mutation
  const addAddress = useMutation({
    mutationFn: async (formData: AddressFormData) => {
      if (!customer?.id) throw new Error('Customer not logged in');

      const isDefault = formData.is_default ?? addresses.length === 0;

      // If this address should be default, unset previous defaults
      if (isDefault && addresses.length > 0) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('customer_id', customer.id);
      }

      // Try inserting with enhanced columns
      const payload: any = {
        customer_id: customer.id,
        label: formData.label.trim() || 'בית',
        street: formData.street.trim(),
        city: formData.city.trim(),
        apartment: formData.apartment?.trim() || null,
        floor: formData.floor?.trim() || null,
        entrance: formData.entrance?.trim() || null,
        postal_code: formData.postal_code?.trim() || null,
        notes: formData.notes?.trim() || null,
        is_default: isDefault,
      };

      let result = await supabase.from('addresses').insert(payload).select().single();

      // If new columns not yet in DB cache, fallback without them and embed in notes
      if (result.error && result.error.message.includes('column')) {
        const extraNotes = [
          formData.apartment ? `דירה ${formData.apartment}` : '',
          formData.floor ? `קומה ${formData.floor}` : '',
          formData.entrance ? `כניסה ${formData.entrance}` : '',
          formData.notes ? formData.notes : '',
        ]
          .filter(Boolean)
          .join(', ');

        const fallbackPayload = {
          customer_id: customer.id,
          label: formData.label.trim() || 'בית',
          street: formData.street.trim(),
          city: formData.city.trim(),
          notes: extraNotes || null,
          is_default: isDefault,
        };

        result = await supabase.from('addresses').insert(fallbackPayload).select().single();
      }

      if (result.error) throw result.error;

      // Sync customer's default_address field
      if (isDefault && result.data) {
        await supabase
          .from('customers')
          .update({ default_address: result.data.id })
          .eq('id', customer.id);

        setCustomer({ ...customer, default_address: result.data.id });
      }

      return result.data as Address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 3. Update Address Mutation
  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AddressFormData> }) => {
      if (!customer?.id) throw new Error('Customer not logged in');

      const isDefault = data.is_default;

      if (isDefault) {
        // Unset others
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('customer_id', customer.id);
      }

      const payload: any = { ...data };
      if (payload.label) payload.label = payload.label.trim();
      if (payload.street) payload.street = payload.street.trim();
      if (payload.city) payload.city = payload.city.trim();

      let result = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', id)
        .eq('customer_id', customer.id)
        .select()
        .single();

      if (result.error && result.error.message.includes('column')) {
        // Strip extra columns that might not exist yet
        delete payload.apartment;
        delete payload.floor;
        delete payload.entrance;
        delete payload.postal_code;

        result = await supabase
          .from('addresses')
          .update(payload)
          .eq('id', id)
          .eq('customer_id', customer.id)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (isDefault) {
        await supabase
          .from('customers')
          .update({ default_address: id })
          .eq('id', customer.id);

        setCustomer({ ...customer, default_address: id });
      }

      return result.data as Address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 4. Delete Address Mutation
  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      if (!customer?.id) throw new Error('Customer not logged in');

      const target = addresses.find((a) => a.id === id);

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('customer_id', customer.id);

      if (error) throw error;

      // If the deleted address was default, clear default or select next
      if (target?.is_default || customer.default_address === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        const nextDefault = remaining[0]?.id || null;

        await supabase
          .from('customers')
          .update({ default_address: nextDefault })
          .eq('id', customer.id);

        if (nextDefault) {
          await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', nextDefault);
        }

        setCustomer({ ...customer, default_address: nextDefault });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 5. Set Default Address Mutation
  const setDefaultAddress = useMutation({
    mutationFn: async (id: string) => {
      if (!customer?.id) throw new Error('Customer not logged in');

      // Unset all
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('customer_id', customer.id);

      // Set target
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('customer_id', customer.id);

      if (error) throw error;

      // Update customer table
      await supabase
        .from('customers')
        .update({ default_address: id })
        .eq('id', customer.id);

      setCustomer({ ...customer, default_address: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    addresses,
    isLoading,
    isError,
    refetch,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    defaultAddress: addresses.find((a) => a.is_default) || addresses[0] || null,
  };
}
