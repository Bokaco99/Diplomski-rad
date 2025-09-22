import { Router } from 'express';
import { KalkulacijeKontroler } from '../kontroleri/kalkulacije-kontroler';
import { samoUlogovani } from '../middleware/auth';

const r = Router();
r.post('/:prostorId', samoUlogovani, KalkulacijeKontroler.kreiraj);
r.get('/:prostorId', samoUlogovani, KalkulacijeKontroler.lista);

export default r;
