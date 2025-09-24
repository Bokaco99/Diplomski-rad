import { Router } from 'express';
import { z } from 'zod';
import { validiraj } from '../middleware/zodValidate.js';
import { KalkulacijeKontroler } from '../kontroleri/kalkulacije-kontroler';
import { samoUlogovani } from '../middleware/auth';

const r = Router();

const Params = z.object({
  prostorId: z.coerce.number().int().positive() // "6" -> 6; odbija NaN/0/negativno
});
r.post('/:prostorId', samoUlogovani, validiraj(Params, 'params'), KalkulacijeKontroler.kreiraj);

r.get('/:prostorId', samoUlogovani, validiraj(Params, 'params'), KalkulacijeKontroler.lista);

export default r;
