import { z } from 'zod';

export const shemaKreirajKalkulaciju = z.object({
  prostorId: z.number().int().positive(),
});
