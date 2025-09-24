import { Router } from 'express';
import { authObavezno, zahtevajUlogu } from '../../middleware/auth';
import { validiraj } from '../../middleware/zodValidate';
import { shemaKreirajProstor, shemaPostaviRadove } from './prostori.sheme';
import { kreirajProstor, mojiProstori, postaviRadoveZaProstor } from './prostori.kontroler';

const r = Router();

r.use(authObavezno);                 // sve ispod zahteva prijavu
r.use(zahtevajUlogu('KLIJENT'));     // ovi endpointi su za klijente

r.post('/', validiraj(shemaKreirajProstor), kreirajProstor);
r.get('/moji', mojiProstori);
r.put('/:id/radovi', validiraj(shemaPostaviRadove), postaviRadoveZaProstor);

export default r;
