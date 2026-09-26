// ============================================================
// Favorite Store — Client-side Favorite Persistence & Sync
// ============================================================
// Persists liked product IDs locally via AsyncStorage so favorites
// work instantly with zero latency, offline, and for guest users.
// Automatically syncs with Supabase when authenticated.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteState {
  favoriteIds: string[];
  addFavoriteId: (productId: string) => void;
  removeFavoriteId: (productId: string) => void;
  toggleFavoriteId: (productId: string) => boolean;
  setFavoriteIds: (ids: string[]) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavoriteId: (productId: string) => {
        const current = get().favoriteIds;
        if (!current.includes(productId)) {
          set({ favoriteIds: [...current, productId] });
        }
      },

      removeFavoriteId: (productId: string) => {
        set({ favoriteIds: get().favoriteIds.filter((id) => id !== productId) });
      },

      toggleFavoriteId: (productId: string) => {
        const current = get().favoriteIds;
        const exists = current.includes(productId);
        if (exists) {
          set({ favoriteIds: current.filter((id) => id !== productId) });
          return false;
        } else {
          set({ favoriteIds: [...current, productId] });
          return true;
        }
      },

      setFavoriteIds: (ids: string[]) => {
        set({ favoriteIds: ids });
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: 'farm-favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
