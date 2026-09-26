// ============================================================
// useFavorites Hook — Enhanced Product Favorites / Liked List
// ============================================================
// Synchronizes client favoriteStore with Supabase database:
// - Instant 0ms optimistic UI toggle with haptic feedback
// - Works seamlessly for authenticated customers and guests
// - Automatic sync of local guest favorites upon login
// - Live count of liked items for top bar / navigation badges

import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Favorite, Product } from '@/types/models';
import { useAuthStore } from '@/stores/authStore';
import { useFavoriteStore } from '@/stores/favoriteStore';
import * as Haptics from 'expo-haptics';

export function useFavorites() {
  const customer = useAuthStore((s) => s.customer);
  const queryClient = useQueryClient();

  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);
  const toggleFavoriteId = useFavoriteStore((s) => s.toggleFavoriteId);
  const addFavoriteId = useFavoriteStore((s) => s.addFavoriteId);
  const setFavoriteIds = useFavoriteStore((s) => s.setFavoriteIds);
  const isLocalFavorite = useFavoriteStore((s) => s.isFavorite);

  // 1. Fetch remote favorites from Supabase for logged in customers
  const { data: remoteFavorites = [], isLoading: isRemoteLoading } = useQuery({
    queryKey: ['favorites', customer?.id],
    queryFn: async () => {
      if (!customer?.id) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('*, product:products(*)')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Favorite[]) || [];
    },
    enabled: !!customer?.id,
  });

  // 2. Fetch products for guest users who have locally saved favoriteIds
  const { data: guestProducts = [], isLoading: isGuestLoading } = useQuery({
    queryKey: ['guest-favorites-products', favoriteIds],
    queryFn: async () => {
      if (customer?.id || favoriteIds.length === 0) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .in('id', favoriteIds)
        .eq('is_active', true);

      if (error) throw error;
      return (data as Product[]) || [];
    },
    enabled: !customer?.id && favoriteIds.length > 0,
  });

  // 3. Sync remote favorites into local store when fetched
  useEffect(() => {
    if (customer?.id && remoteFavorites.length > 0) {
      const remoteIds = remoteFavorites.map((f) => f.product_id);
      setFavoriteIds(remoteIds);
    }
  }, [customer?.id, remoteFavorites, setFavoriteIds]);

  // 4. Sync guest favorites to Supabase when customer signs in
  useEffect(() => {
    async function syncGuestFavorites() {
      if (!customer?.id || favoriteIds.length === 0) return;

      const remoteIds = new Set(remoteFavorites.map((f) => f.product_id));
      const missingInRemote = favoriteIds.filter((id) => !remoteIds.has(id));

      if (missingInRemote.length > 0) {
        const rowsToInsert = missingInRemote.map((productId) => ({
          customer_id: customer.id,
          product_id: productId,
        }));

        await supabase.from('favorites').upsert(rowsToInsert, {
          onConflict: 'customer_id,product_id',
          ignoreDuplicates: true,
        });

        queryClient.invalidateQueries({ queryKey: ['favorites', customer.id] });
      }
    }

    syncGuestFavorites();
  }, [customer?.id, favoriteIds, queryClient, remoteFavorites]);

  // 5. Toggle favorite mutation (optimistic + remote sync)
  const toggleMutation = useMutation({
    mutationFn: async ({ productId, isCurrentlyFav }: { productId: string; isCurrentlyFav: boolean }) => {
      if (!customer?.id) return;

      if (isCurrentlyFav) {
        // Remove from database
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('customer_id', customer.id)
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        // Insert into database
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
      if (customer?.id) {
        queryClient.invalidateQueries({ queryKey: ['favorites', customer.id] });
      }
    },
    onError: (err, { productId, isCurrentlyFav }) => {
      console.warn('Error syncing favorite with database, reverting:', err);
      // Revert local store on network failure
      toggleFavoriteId(productId);
    },
  });

  const toggleFavorite = useCallback(
    (productId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const currentlyFav = isLocalFavorite(productId);
      // 1. Instant local toggle
      toggleFavoriteId(productId);

      // 2. Background database sync if logged in
      if (customer?.id) {
        toggleMutation.mutate({ productId, isCurrentlyFav: currentlyFav });
      }
    },
    [customer?.id, isLocalFavorite, toggleFavoriteId, toggleMutation]
  );

  // Consolidated favorite products list
  const favoriteProducts: Product[] = customer?.id
    ? (remoteFavorites.map((f) => f.product).filter(Boolean) as Product[])
    : guestProducts;

  const isLoading = customer?.id ? isRemoteLoading : isGuestLoading;

  return {
    favorites: remoteFavorites,
    favoriteProducts,
    favoriteCount: customer?.id ? remoteFavorites.length : favoriteIds.length,
    isLoading,
    toggleFavorite,
    isFavorite: (productId: string) => isLocalFavorite(productId),
  };
}
