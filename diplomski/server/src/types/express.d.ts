import { Uloga } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      korisnik?: { id: number; uloga: Uloga };
    }
  }
}

export {};
