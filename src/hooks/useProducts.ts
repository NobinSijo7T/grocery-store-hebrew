// ============================================================
// useProducts Hook
// ============================================================
// Fetches products with filtering, sorting, and pagination.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product, ProductFilters } from '@/types/models';

async function fetchProducts(filters: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true);

  // Apply filters
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  
  if (filters.search) {
    // Note: This uses Postgres Full Text Search if configured, otherwise ilike
    query = query.ilike('name_he', `%${filters.search}%`);
  }

  if (filters.inStockOnly) {
    query = query.gt('stock_qty', 0);
  }

  if (filters.organicOnly) {
    query = query.eq('is_organic', true);
  }

  if (filters.seasonalOnly) {
    query = query.not('seasonal_tag', 'is', null);
  }

  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured);
  }

  if (filters.isOffer !== undefined) {
    query = query.eq('is_offer', filters.isOffer);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
    default:
      // For now, default to created_at or sort_order if we add one.
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as Product[];
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
}

// Hook for a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Product;
    },
    enabled: !!id,
  });
}
