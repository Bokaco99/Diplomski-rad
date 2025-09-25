import { http } from '../../lib/axios'; 

// http.get('/prostori/moji'), http.post('/prostori'), http.delete('/prostori/:id')

//  Tipovi 
export type Uloga = 'KLIJENT' | 'IZVODJAC' | 'ADMIN';

export type Identitet = {
  korisnikId: number;
  uloga: Uloga;
};

export type OdgovorJa = {
  ulogovan: boolean;
  identitet: Identitet | null;
};

export type PrijavaDto = {
  email: string;
  lozinka: string;
};

export type RegistracijaDto = {
  email: string;
  lozinka: string;
  ime: string;
  // Dozvoljavamo samo KLIJENT ili IZVODJAC pri registraciji.
  uloga: Extract<Uloga, 'KLIJENT' | 'IZVODJAC'>;
};


export type KorisnikOsnovno = {
  id: number;
  ime: string;
  email: string;
  uloga: Extract<Uloga, 'KLIJENT' | 'IZVODJAC'>;
};

//  normalizacija uloge 
export function normalizujUlogu(
  uloga?: string
): Uloga | undefined {
  if (!uloga) return undefined;
  let s = String(uloga).trim().toUpperCase();

  // skini razmake
  s = s.replace(/\s+/g, '');

  // mapiraj srpska slova: Đ/Ć/Č/Š/Ž
  const map: Record<string, string> = { 'Đ': 'DJ', 'Ć': 'C', 'Č': 'C', 'Š': 'S', 'Ž': 'Z' };
  s = s.split('').map(ch => map[ch] ?? ch).join('');

  if (s === 'KLIJENT' || s === 'KORISNIK' || s === 'CLIENT' || s === 'USER') return 'KLIJENT';
  if (s === 'IZVODJAC' || s === 'CONTRACTOR' || s === 'VENDOR') return 'IZVODJAC';
  if (s === 'ADMIN' || s === 'ADMINISTRATOR') return 'ADMIN';
  return undefined;
}

// API pozivi
// Napomena:  prosledjujemo { withCredentials: true } da bi kolacici (JWT) putovali.

export async function prijava(podaci: PrijavaDto) {
  const { data } = await http.post('/auth/login', podaci, { withCredentials: true });
  return data as { ulogovan: true; identitet: Identitet };
}

export async function registracija(podaci: RegistracijaDto) {
  const { data } = await http.post('/auth/registracija', podaci, { withCredentials: true });
  // data moze biti { id, ime, email, uloga } ili { id, ime, email, tip }
  const uloga =
    normalizujUlogu((data as any)?.uloga ?? (data as any)?.tip) ?? 'KLIJENT';
  const rez: KorisnikOsnovno = {
    id: data.id,
    ime: data.ime,
    email: data.email,
    uloga: uloga as Extract<Uloga, 'KLIJENT' | 'IZVODJAC'>,
  };
  return rez;
}

export async function ja() {
  const { data } = await http.get('/auth/ja', { withCredentials: true });
  // ocekuje se { ulogovan: boolean, identitet: { korisnikId, uloga } | null }
  if (data?.identitet?.uloga) {
    const norm = normalizujUlogu(data.identitet.uloga);
    if (norm) data.identitet.uloga = norm;
  }
  return data as OdgovorJa;
}

export async function odjava() {
  const { data } = await http.post('/auth/logout', null, { withCredentials: true });
  return data as { ulogovan: false };
}
