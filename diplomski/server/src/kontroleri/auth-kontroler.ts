import type { Request, Response } from 'express';
import { KONFIG } from '../config';
import { login, registracija } from '../servisi/auth-servis';

const prod = process.env.NODE_ENV === 'production';
const maxAge = (Number(process.env.JWT_EXPIRES_IN_DAYS ?? 7)) * 24 * 60 * 60 * 1000;

const cookieOpcije = {
  httpOnly: true as const,
  sameSite: 'lax' as const,
  secure: prod,
  path: '/' as const,
  maxAge,
  
};

export class AuthKontroler {
  static async registracija(req: Request, res: Response) {
    try {
      const { ime, email, lozinka, uloga } = req.body;
      const korisnik = await registracija(ime, email, lozinka, uloga);
      return res.status(201).json(korisnik);
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, lozinka } = req.body;
      const { token, payload } = await login(email, lozinka);

      // SET — koristi cookieOpcije
      res.cookie(KONFIG.jwtCookieName, token, cookieOpcije);

      return res.json({ ulogovan: true, identitet: payload });
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }

  static async logout(_req: Request, res: Response) {
    // CLEAR — koristi potpuno isti objekat
    res.clearCookie(KONFIG.jwtCookieName, cookieOpcije);

    // (opciono, dodatni "hammer": poništi kolačić setovanjem maxAge=0)
    res.cookie(KONFIG.jwtCookieName, '', { ...cookieOpcije, maxAge: 0 });

    return res.json({ ulogovan: false });
  }

  static async ja(req: Request, res: Response) {
    if (!req.identitet) return res.json({ ulogovan: false, identitet: null });
    return res.json({ ulogovan: true, identitet: req.identitet });
  }
}

