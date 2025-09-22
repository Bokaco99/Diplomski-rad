import jwt from 'jsonwebtoken';
import { KONFIG } from '../config';

export type Uloga = 'KLIJENT' | 'IZVODJAC';
export type Identitet = { korisnikId: number; uloga: Uloga };

declare global {
  namespace Express {
    // Dodajemo polje na req da znamo ko je ulogovan
    interface Request {
      identitet?: Identitet;
    }
  }
}

// Čitanje JWT iz httpOnly cookie-a
export function autentikacija(req: any, _res: any, next: any) {
  const token = req.cookies?.[KONFIG.jwtCookieName];
  if (token) {
    try {
      req.identitet = jwt.verify(token, KONFIG.jwtTajna) as Identitet;
    } catch {}
  }
  next();
}

// Dozvoli samo ulogovane
export function samoUlogovani(req: any, res: any, next: any) {
  if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
  next();
}

// Dozvoli samo određenu ulogu
export function samoUloga(uloga: Uloga) {
  return (req: any, res: any, next: any) => {
    if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
    if (req.identitet.uloga !== uloga) return res.status(403).json({ greska: 'Zabranjeno.' });
    next();
  };
}
