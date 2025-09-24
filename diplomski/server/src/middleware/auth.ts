import { KONFIG } from '../config';
import { verifikujToken } from '../utils/jwt';

export type Uloga = 'KLIJENT' | 'IZVODJAC';
export type Identitet = { korisnikId: number; uloga: Uloga };

declare global {
  namespace Express {
    interface Request {
      // Popunjava se ako postoji validan JWT
      identitet?: Identitet;
    }
  }
}

// Čitanje JWT iz httpOnly cookie-a i punjenje req.identitet
export function autentikacija(req: any, _res: any, next: any) {
  const token = req.cookies?.[KONFIG.jwtCookieName];
  if (token) {
    try {
      // Token treba da sadrži { korisnikId, uloga }
      const data = verifikujToken<{ korisnikId: number; uloga: 'KLIJENT'|'IZVODJAC' }>(token);
      if (data?.korisnikId && data?.uloga) {
        req.identitet = { korisnikId: Number(data.korisnikId), uloga: data.uloga };
      }
    } catch {
      // nevažeći/istekao token -> tretiramo kao gosta
    }
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

export { samoUlogovani as authObavezno };

export { autentikacija as authOpcioni };

export const zahtevajUlogu = samoUloga;

