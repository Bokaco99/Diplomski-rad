import axios from 'axios';
import { KONST } from './constants';
import { prikaziGresku } from '../components/ui/Toast';

export const http = axios.create({
  baseURL: KONST.apiBase,
  withCredentials: true
});

// Odgovori: globalni hendling
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.greska || err?.message || 'Došlo je do greške';
    if (status === 401) {
      // Sesija istekla ili nije prijavljen
      window.location.href = '/login';
    } else {
      prikaziGresku(msg);
    }
    return Promise.reject(err);
  }
);
