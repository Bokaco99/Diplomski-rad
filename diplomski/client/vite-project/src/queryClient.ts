import { QueryClient } from '@tanstack/react-query';

export const klijentUpita = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});
