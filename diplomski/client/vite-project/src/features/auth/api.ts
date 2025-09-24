// src/features/auth/api.ts
import { http } from '../../lib/axios';

export type Uloga = 'KLIJENT' | 'IZVODJAC' | 'ADMIN';

export type LoginDto = {
  email: string;
  lozinka: string;
};

export type RegistracijaDto = {
  email: string;
  lozinka: string;
  ime: string;
  uloga: Uloga;
};

export function login(data: LoginDto) {
  // BE: POST /api/auth/login
  return http.post('/auth/login', data).then(r => r.data);
}

export function registracija(data: RegistracijaDto) {
  // BE: POST /api/auth/registracija
  return http.post('/auth/registracija', data).then(r => r.data);
}

export function ja() {
  // BE: GET /api/auth/ja
  return http.get('/auth/ja').then(r => r.data);
}

export function logout() {
  // BE: POST /api/auth/logout
  return http.post('/auth/logout');
}
