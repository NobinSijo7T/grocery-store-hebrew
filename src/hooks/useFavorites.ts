// ============================================================
// useFavorites Hook
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Favorite, Product } from '@/types/models';
import { useAuthStore } from '@/stores/authStore';

export function useFavorites() {
  const customer = useAuthStore((s) => s.customer);
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', customer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, product:products(*)')
        .eq('customer_id', customer!.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Favorite[];
    },
    enabled: !!customer?.id,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (productId: string) => {
      if (!customer?.id) return;

      const isFav = favorites?.some((f) => f.product_id === productId);

      if (isFav) {
        // Remove
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('customer_id', customer.id)
          .eq('product_id', productId);
        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase
          .from('favorites')
          .insert({
            customer_id: customer.id,
            product_id: productId,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', customer?.id] });
    },
  });

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite: (productId: string) => 
      favorites?.some((f) => f.product_id === productId) ?? false,
  };
}
