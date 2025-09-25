import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ja, prijava, odjava, registracija } from '../../features/auth/api';

// GET /auth/ja
export function useJa() {
  const q = useQuery({
    queryKey: ['auth', 'ja'],
    queryFn: ja
  });

  return {
    podaci: q.data,
    ucitava: q.isLoading,
    greska: q.isError
  };
}

// POST /auth/login
export function usePrijava() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, lozinka }: { email: string; lozinka: string }) =>
      prijava({ email, lozinka }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'ja'] });
    }
  });
}

// POST /auth/logout
export function useOdjava() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => odjava(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'ja'] });
    }
  });
}

// POST /auth/registracija  (ako koristiš registraciju na FE)
export function useRegistracija() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      email: string;
      lozinka: string;
      ime: string;
      uloga: 'KLIJENT' | 'IZVODJAC';
    }) => registracija(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'ja'] });
    }
  });
}

