import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ja, prijava, odjava, registracija } from './api';
import type { OdgovorJa, Uloga, PrijavaDto, RegistracijaDto } from './api';

const KEY_JA = ['auth', 'ja'] as const;

// GET /auth/ja
export function useJa() {
  const q = useQuery({
    queryKey: KEY_JA,
    queryFn: ja,
    staleTime: 5 * 60 * 1000,
  });

  const odgovor: OdgovorJa | undefined = q.data;
  const ulogovan = !!odgovor?.ulogovan && !!odgovor?.identitet;
  const uloga: Uloga | undefined = odgovor?.identitet?.uloga;

  return {
    ...q,
    podaci: odgovor,     // kompatibilno sa tvojim ranijim imenovanjem
    ulogovan,
    uloga,
    korisnikId: odgovor?.identitet?.korisnikId ?? null,
    isKlijent: uloga === 'KLIJENT',
    isIzvodjac: uloga === 'IZVODJAC',
    isAdmin: uloga === 'ADMIN',
    ucitava: q.isLoading,
    greska: q.isError,
  };
}

// POST /auth/login
export function usePrijava() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PrijavaDto) => prijava(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY_JA });
    },
  });
}

// POST /auth/logout
export function useOdjava() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => odjava(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY_JA });
    },
  });
}

// POST /auth/registracija
export function useRegistracija() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegistracijaDto) => registracija(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY_JA });
    },
  });
}
