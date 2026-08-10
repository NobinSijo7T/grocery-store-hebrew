// ============================================================
// useCategories Hook
// ============================================================
// Fetches active categories from Supabase.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/models';

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}
