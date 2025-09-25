// src/lib/axios.ts
import axios from 'axios';
import { prikaziGresku } from '../components/ui/Toast';


export const http = axios.create({
  baseURL: '/api',
  withCredentials: true, 
  timeout: 15000,        
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', //  
  },
});

// (opciono) ako negde radiš default import
export default http;

let lastToast = { msg: '', at: 0 };
let redirecting401 = false;

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isCancel(err)) return Promise.reject(err);

    const status = err?.response?.status;
    const msg =
      err?.response?.data?.greska ||
      err?.message ||
      'Došlo je do greške';

    if (status === 401) {
      // istekla sesija → vrati na /prijava (jednokratno)
      if (!redirecting401 && window.location.pathname !== '/prijava') {
        redirecting401 = true;
        window.location.href = '/prijava';
      }
    } else {
      // anti-spam za toast
      const now = Date.now();
      if (msg !== lastToast.msg || now - lastToast.at > 2000) {
        prikaziGresku(msg);
        lastToast = { msg, at: now };
      }
    }

    return Promise.reject(err);
  }
);

