import { z } from 'zod';

export const shemaKreirajProstor = z.object({
  naziv: z.string().min(1),
  kvadratura: z.number().positive(),
  tip: z.enum(['STAN', 'KANCELARIJA']),
  budzet: z.number().nonnegative(),
});

export const shemaPostaviRadove = z.object({
  radIds: z.array(z.number().int().positive()).min(1, 'Izaberi bar jedan rad'),
});
