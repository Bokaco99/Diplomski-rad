import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { KONFIG } from '../config';
import { napraviToken } from '../utils/jwt';

export async function registracija(ime: string, email: string, lozinka: string, uloga: 'KLIJENT'|'IZVODJAC') {
  const postoji = await prisma.korisnik.findUnique({ where: { email } });
  if (postoji) throw new Error('Email je već zauzet.');
  const hash = await bcrypt.hash(lozinka, 10);
  const korisnik = await prisma.korisnik.create({
    data: { ime, email, lozinkaHash: hash, tip: uloga as any },
    select: { id: true, ime: true, email: true, tip: true }
  });
  return korisnik;
}

export async function login(email: string, lozinka: string) {
  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik) throw new Error('Neispravan email.');
  const hash = await bcrypt.hash(lozinka, 10);
  const ok = await bcrypt.compare(lozinka, korisnik.lozinkaHash);
  if (!ok) throw new Error('Pogrešna lozinka.');
  const payload = { korisnikId: korisnik.id, uloga: korisnik.tip };
 const token = napraviToken(payload);
  return { token, payload };
}
