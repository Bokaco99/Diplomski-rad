// src/features/auth/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ja, login } from '../../features/auth/api';

export function useMe() {
  const q = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: ja
  });
  return {
    podaci: q.data,
    ucitava: q.isLoading,
    greska: q.isError
  };
}

export function usePrijava() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, lozinka }: { email: string; lozinka: string }) =>
      login({ email, lozinka }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  });
}

