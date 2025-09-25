// src/features/spaces/api.ts
import { http } from '../../lib/axios';

// Dozvoljavamo oba seta vrednosti da bismo bili kompatibilni sa backendom
export type TipProstora = 'STAN' | 'POSLOVNI' | 'APARTMENT' | 'OFFICE';

/* ====================== Tipovi ====================== */
export interface Prostor {
  id: number;
  naziv: string;
  kvadratura: number;
  tip: TipProstora;
  budzet?: number | null;
  korisnikId?: number;
}

export interface Rad {
  id: number;
  naziv: string;
  opis?: string | null;
  cenaPoM2: number;
  trajanjeDana?: number | null;
}

export interface Materijal {
  id: number;
  naziv: string;
  cena: number;
  potrosnjaPoM2: number;
}

export interface Kalkulacija {
  id: number;
  prostorId: number;
  ukupniTroskoviRsd: number;
  procenjenoVremeDana: number;
  datumKreiranja: string;
  detalji?: any;
}

export interface Ponuda {
  id: number;
  prostorId: number;
  cenaRsd: number;
  trajanjeDana: number;
  status: 'NOVO' | 'PRIHVACENO' | 'ODBIJENO';
  datumKreiranja: string;
}

/* ====================== Prostori ====================== */
export async function dohvatiProstore(): Promise<Prostor[]> {
  const { data } = await http.get('/spaces');
  // backend može vratiti { items: [...] } ili direktno niz
  return data?.items ?? data ?? [];
}

export async function kreirajProstor(payload: {
  naziv: string;
  kvadratura: number;
  tip: TipProstora;
  budzet?: number | null;
}) {
  const { data } = await http.post('/spaces', payload);
  return data as Prostor;
}

export async function obrisiProstor(id: number) {
  const { data } = await http.delete(`/spaces/${id}`);
  return data as { uspesno: boolean } | Prostor | undefined;
}

export async function getProstor(id: number): Promise<Prostor> {
  const { data } = await http.get(`/spaces/${id}`);
  // backend može vratiti { prostor: {...} } ili direktno objekat
  return data?.prostor ?? data;
}

/* ====================== Katalog (radovi/materijali) ====================== */
export async function getRadovi(): Promise<Rad[]> {
  const { data } = await http.get('/works');
  return data?.radovi ?? data ?? [];
}

export async function getMaterijali(): Promise<Materijal[]> {
  const { data } = await http.get('/materials');
  return data?.materijali ?? data ?? [];
}

/* ====================== Kalkulacije ====================== */
export async function postKalkulacija(input: {
  prostorId: number;
  workIds: number[];
  materialIds: number[];
}) {
  const { data } = await http.post('/calculations', input);
  // očekujemo { kalkulacija: {...} }
  return data as { kalkulacija: Kalkulacija };
}

export async function getKalkulacijeByProstor(prostorId: number) {
  const { data } = await http.get(`/calculations?spaceId=${prostorId}`);
  return (data?.kalkulacije ?? data ?? []) as Kalkulacija[];
}

/* ====================== Ponude ====================== */
export async function getPonudeByProstor(prostorId: number) {
  const { data } = await http.get(`/offers?spaceId=${prostorId}`);
  return (data?.ponude ?? data ?? []) as Ponuda[];
}

export async function postPonuda(input: {
  prostorId: number;
  cenaRsd: number;
  trajanjeDana: number;
}) {
  const { data } = await http.post('/offers', input);
  // očekujemo { ponuda: {...} }
  return data as { ponuda: Ponuda };
}

export async function putPonudaStatus(
  id: number,
  status: 'NOVO' | 'PRIHVACENO' | 'ODBIJENO'
) {
  const { data } = await http.put(`/offers/${id}`, { status });
  return data as { ponuda: Ponuda };
}
