import { z } from 'zod';

export const shemaRegistracije = z.object({
  email: z.string().email('Neispravan email'),
  lozinka: z.string().min(6, 'Lozinka mora imati bar 6 karaktera'),
  uloga: z.enum(['KLIJENT', 'IZVODJAC']).default('KLIJENT'),
  ime: z.string().min(1, 'Ime je obavezno').max(100),
});

export const shemaLogina = z.object({
  email: z.string().email(),
  lozinka: z.string().min(6),
});
