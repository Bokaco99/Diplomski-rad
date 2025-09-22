import { Router } from 'express';
import { PonudeKontroler } from '../kontroleri/ponude-kontroler';
import { samoUlogovani, samoUloga } from '../middleware/auth';

const r = Router();
r.post('/:prostorId', samoUlogovani, samoUloga('IZVODJAC'), PonudeKontroler.kreiraj);
r.get('/:prostorId', samoUlogovani, PonudeKontroler.listaZaProstor);
r.patch('/:ponudaId/status', samoUlogovani, PonudeKontroler.promeniStatus);

export default r;
