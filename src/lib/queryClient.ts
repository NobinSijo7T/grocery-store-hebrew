// ============================================================
// TanStack React Query Client
// ============================================================

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false, // Not needed on mobile
    },
    mutations: {
      retry: 1,
    },
  },
});
