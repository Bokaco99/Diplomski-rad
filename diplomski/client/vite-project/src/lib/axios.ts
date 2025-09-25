import axios from 'axios';
import { KONST } from './constants';
import { prikaziGresku } from '../components/ui/Toast';

export const http = axios.create({ baseURL: '/api', withCredentials: true });


http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let lastToast = { msg: '', at: 0 };
let redirecting401 = false;

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // ako je abortovano ili network error bez response-a
    if (axios.isCancel(err)) return Promise.reject(err);

    const status = err?.response?.status;
    const msg =
      err?.response?.data?.greska ||
      err?.message ||
      'Došlo je do greške';

    if (status === 401) {
      // istekla sesija
      if (!redirecting401 && window.location.pathname !== '/prijava') {
        redirecting401 = true;
        window.location.href = '/prijava';
      }
    } else {
      // anti spam
      const now = Date.now();
      if (msg !== lastToast.msg || now - lastToast.at > 2000) {
        prikaziGresku(msg);
        lastToast = { msg, at: now };
      }
    }

    return Promise.reject(err);
  }
);
