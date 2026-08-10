// ============================================================
// useBanners Hook
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Banner } from '@/types/models';

async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Banner[];
}

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });
}
