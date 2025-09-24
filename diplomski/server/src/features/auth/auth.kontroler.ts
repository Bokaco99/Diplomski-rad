import { Request, Response } from 'express';
import { prisma } from '../../prisma';
import bcrypt from 'bcryptjs';
import { napraviToken } from '../../utils/jwt';
import { TipKorisnika } from '@prisma/client';
import { KONFIG } from '../../config';
type Uloga = TipKorisnika;
export const ULOGA = TipKorisnika;

const cookieOpcije = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
};

export async function registracija(req: Request, res: Response) {
  const { email, lozinka, uloga, ime } = req.body as {
    email: string; lozinka: string; uloga: Uloga; ime: string;
  };

  const postoji = await prisma.korisnik.findUnique({ where: { email } });
  if (postoji) return res.status(409).json({ greska: 'Email je već registrovan' });

  const hash = await bcrypt.hash(lozinka, 10);

  const korisnik = await prisma.korisnik.create({
    data: { email, lozinkaHash: hash, tip:uloga , ime },
    select: { id: true, email: true, tip: true, ime: true },
  });

  // 🔧 JWT mora imati { korisnikId, uloga } da bi middleware popunio req.identitet
  const token = napraviToken({ korisnikId: korisnik.id, uloga: korisnik.tip });
  res.cookie('token', token, cookieOpcije);

  return res.status(201).json({ korisnik });
}

export async function login(req: Request, res: Response) {
  const { email, lozinka } = req.body as { email: string; lozinka: string };

  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik) return res.status(400).json({ greska: 'Pogrešan email ili lozinka' });

  const ok = await bcrypt.compare(lozinka, korisnik.lozinkaHash);
  if (!ok) return res.status(400).json({ greska: 'Pogrešan email ili lozinka' });

  // 🔧 isti payload oblik kao gore
  const token = napraviToken({ korisnikId: korisnik.id, uloga: korisnik.tip });
  res.cookie('token', token, cookieOpcije);

  return res.json({
    korisnik: { id: korisnik.id, email: korisnik.email, uloga: korisnik.tip, ime: korisnik.ime },
  });
}

export async function ja(req: Request, res: Response) {
  if (!req.identitet) return res.status(401).json({ greska: 'Niste prijavljeni' });

  const korisnik = await prisma.korisnik.findUnique({
    where: { id: req.identitet.korisnikId },
    select: { id: true, email: true, tip: true, ime: true },
  });

  return res.json({ korisnik });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(KONFIG.jwtCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  return res.json({ ok: true });
}
