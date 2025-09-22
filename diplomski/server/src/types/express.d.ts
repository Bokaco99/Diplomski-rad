import { Uloga } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      // Popunjava middleware nakon verifikacije JWT-a
      korisnik?: { id: number; uloga: Uloga };
    }
  }
}

export {};
