import { Router } from 'express';
import { authOpcioni } from '../../middleware/auth';
import { listajMaterijale, listajRadove } from './katalog.kontroler';

const r = Router();

r.use(authOpcioni); // dozvoli gostima da gledaju katalog, ali popuni req.korisnik ako postoji

r.get('/radovi', listajRadove);
r.get('/materijali', listajMaterijale);

export default r;
