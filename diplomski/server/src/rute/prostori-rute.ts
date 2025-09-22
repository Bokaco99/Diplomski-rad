import { Router } from 'express';
import { ProstoriKontroler } from '../kontroleri/prostori-kontroler';
import { samoUlogovani } from '../middleware/auth';

const r = Router();
r.post('/', samoUlogovani, ProstoriKontroler.kreiraj);
r.get('/moji', samoUlogovani, ProstoriKontroler.moji);
r.put('/:id/radovi', samoUlogovani, ProstoriKontroler.postaviRadove);

export default r;
