// src/lib/mock.ts
export const mockRadovi = [
  { id: 1, naziv: 'Krečenje', opis: 'Dva sloja', cenaPoM2: 250, trajanjeDana: 2 },
  { id: 2, naziv: 'Keramika', opis: 'Kupatilo', cenaPoM2: 1800, trajanjeDana: 5 },
  { id: 3, naziv: 'Parket', opis: 'Brušenje i lakiranje', cenaPoM2: 1200, trajanjeDana: 3 },
];

export const mockMaterijali = [
  { id: 1, naziv: 'Jupol boja', cena: 800, potrosnjaPoM2: 0.2 },
  { id: 2, naziv: 'Ceresit lepak', cena: 1200, potrosnjaPoM2: 0.4 },
  { id: 3, naziv: 'Fug masa', cena: 650, potrosnjaPoM2: 0.1 },
];

export const mockProstori = [
  { id: 1, naziv: 'Stan 55m²', kvadratura: 55, tip: 'STAN', budzet: 300_000 },
  { id: 2, naziv: 'Lokal 32m²', kvadratura: 32, tip: 'POSLOVNI', budzet: 180_000 },
];

// Jednostavan in-memory mock ponuda (opciono)
let _ponude = [
  { id: 101, prostorId: 1, cenaRsd: 150_000, trajanjeDana: 12, status: 'NOVO', datumKreiranja: new Date().toISOString() },
];

export function mockGetPonudeByProstor(prostorId: number) {
  return _ponude.filter(p => p.prostorId === prostorId);
}
export function mockPostPonuda(input: { prostorId: number; cenaRsd: number; trajanjeDana: number }) {
  const nova = { id: Date.now(), status: 'NOVO' as const, datumKreiranja: new Date().toISOString(), ...input };
  _ponude = [nova, ..._ponude];
  return { ponuda: nova };
}
export function mockPutPonudaStatus(id: number, status: 'NOVO' | 'PRIHVACENO' | 'ODBIJENO') {
  _ponude = _ponude.map(p => (p.id === id ? { ...p, status } : p));
  return { ponuda: _ponude.find(p => p.id === id)! };
}
