// ============================================================
// Filter Store — Zustand
// ============================================================

import { create } from 'zustand';
import type { SortOption, ProductFilters } from '@/types/models';

interface FilterState extends ProductFilters {
  setCategory: (categoryId: string | undefined) => void;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  setPriceRange: (min?: number, max?: number) => void;
  toggleInStockOnly: () => void;
  toggleOrganicOnly: () => void;
  toggleSeasonalOnly: () => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const initialState: ProductFilters = {
  categoryId: undefined,
  search: '',
  minPrice: undefined,
  maxPrice: undefined,
  inStockOnly: false,
  organicOnly: false,
  seasonalOnly: false,
  isFeatured: undefined,
  isOffer: undefined,
  sort: 'popular',
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setCategory: (categoryId) => set({ categoryId }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  toggleInStockOnly: () => set((s) => ({ inStockOnly: !s.inStockOnly })),
  toggleOrganicOnly: () => set((s) => ({ organicOnly: !s.organicOnly })),
  toggleSeasonalOnly: () => set((s) => ({ seasonalOnly: !s.seasonalOnly })),
  resetFilters: () => set(initialState),
  hasActiveFilters: () => {
    const s = get();
    return !!(
      s.categoryId ||
      s.search ||
      s.minPrice ||
      s.maxPrice ||
      s.inStockOnly ||
      s.organicOnly ||
      s.seasonalOnly
    );
  },
}));
