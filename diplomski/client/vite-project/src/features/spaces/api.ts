import { http } from '../../lib/axios';

export type Prostor = {
  id: number;
  naziv: string;
  kvadratura: number;
  tip: 'APARTMENT' | 'OFFICE';
  budzet?: number | null;
};

export async function dohvatiProstore(): Promise<Prostor[]> {
  const { data } = await http.get('/spaces');
  return data?.items ?? data ?? [];
}
